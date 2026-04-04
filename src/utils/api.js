const FALLBACK_API_URL = 'https://sinxode-backend.onrender.com'
const RETRYABLE_STATUS = new Set([502, 504])
const DEFAULT_RETRIES = 2
const DEFAULT_RETRY_DELAY_MS = 500

const viteApiUrl = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_API_URL : ''
const craApiUrl = typeof process !== 'undefined' ? process?.env?.REACT_APP_API_URL : ''
const rawBaseUrl = viteApiUrl || craApiUrl || FALLBACK_API_URL

export const BASE_URL = String(rawBaseUrl).replace(/\/+$/, '')

export const API_HEADERS = Object.freeze({
  Accept: 'application/json',
})

export const SYSTEM_OFFLINE_FALLBACK = Object.freeze({
  uptime: '—',
  local_time_kerala: '',
  current_status: 'System Offline',
  availability_status: 'SYSTEM_OFFLINE',
})

export function buildApiUrl(path) {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path || ''}`
  return `${BASE_URL}${normalizedPath}`
}

function delay(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

function shouldRetryStatus(status) {
  return RETRYABLE_STATUS.has(status)
}

function toRequestUrl(pathOrUrl) {
  const target = String(pathOrUrl || '')
  return /^https?:\/\//i.test(target) ? target : buildApiUrl(target)
}

async function safeReadJson(response) {
  if (!response || response.status === 204) return null
  const body = await response.text()
  if (!body.trim()) return null
  try {
    return JSON.parse(body)
  } catch {
    return null
  }
}

export async function apiFetch(pathOrUrl, options = {}, config = {}) {
  const retries = Number.isInteger(config.retries) ? config.retries : DEFAULT_RETRIES
  const retryDelayMs = Number.isInteger(config.retryDelayMs) ? config.retryDelayMs : DEFAULT_RETRY_DELAY_MS
  const url = toRequestUrl(pathOrUrl)

  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        ...options,
        headers: {
          ...API_HEADERS,
          ...(options.headers || {}),
        },
      })

      if (response.ok) return response
      if (shouldRetryStatus(response.status) && attempt < retries) {
        await delay(retryDelayMs * (attempt + 1))
        continue
      }
      return response
    } catch (error) {
      if (error?.name === 'AbortError') throw error
      lastError = error
      if (attempt < retries) {
        await delay(retryDelayMs * (attempt + 1))
        continue
      }
      throw error
    }
  }

  throw lastError || new Error('api_fetch_failed')
}

export async function apiFetchJson(pathOrUrl, options = {}, config = {}) {
  const fallback = config.fallback

  try {
    const response = await apiFetch(pathOrUrl, options, config)
    if (!response.ok) {
      if (fallback !== undefined) return fallback
      throw new Error(`api_http_${response.status}`)
    }

    const data = await safeReadJson(response)
    if (data == null && fallback !== undefined) return fallback
    return data
  } catch (error) {
    if (fallback !== undefined) return fallback
    throw error
  }
}
