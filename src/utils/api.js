const FALLBACK_API_URL = 'https://sinxode-backend.onrender.com'
const LOCAL_DEV_API_URL = ''
const RETRYABLE_STATUS = new Set([502, 504])
const DEFAULT_RETRIES = 2
const DEFAULT_RETRY_DELAY_MS = 500

const isViteDev = typeof import.meta !== 'undefined' ? Boolean(import.meta?.env?.DEV) : false
const isLocalRuntimeHost =
  typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
const viteApiUrl = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_API_URL : ''
const viteApiUrlDev = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_API_URL_DEV : ''
const useProdApiInDev =
  typeof import.meta !== 'undefined' ? String(import.meta?.env?.VITE_USE_PROD_API_IN_DEV || '') === 'true' : false
const craApiUrl = typeof process !== 'undefined' ? process?.env?.REACT_APP_API_URL : ''

function normalizeDevApiUrl(url) {
  const value = String(url || '').trim()
  if (!value) return value
  if (value.startsWith('https://localhost')) return value.replace('https://localhost', 'http://localhost')
  if (value.startsWith('https://127.0.0.1')) return value.replace('https://127.0.0.1', 'http://127.0.0.1')
  return value
}

function isRemoteAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url) && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)
}

function resolveBaseUrl() {
  const localMode = isViteDev || isLocalRuntimeHost
  if (!localMode) {
    return String(viteApiUrl || craApiUrl || FALLBACK_API_URL).trim()
  }

  const devCandidate = normalizeDevApiUrl(viteApiUrlDev || '')
  if (devCandidate) return devCandidate

  const defaultCandidate = normalizeDevApiUrl(viteApiUrl || craApiUrl || '')
  if (!defaultCandidate) return LOCAL_DEV_API_URL
  if (useProdApiInDev || !isRemoteAbsoluteUrl(defaultCandidate)) return defaultCandidate
  return LOCAL_DEV_API_URL
}

const rawBaseUrl = resolveBaseUrl()

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
  return BASE_URL ? `${BASE_URL}${normalizedPath}` : normalizedPath
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
