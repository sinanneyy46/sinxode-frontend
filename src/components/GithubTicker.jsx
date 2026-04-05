import { useEffect, useState } from "react";
import { fetchLatestGitHubSignal } from "../lib/githubapi";

function formatTs(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function GithubTicker() {
  const [row, setRow] = useState(null);
  const [err, setErr] = useState(false);
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  );

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetchLatestGitHubSignal()
        .then((data) => {
          if (!alive) return;
          if (data?.commit_message) {
            setRow(data);
            setErr(false);
          } else {
            setErr(true);
          }
        })
        .catch(() => alive && setErr(true));
    };
    load();
    const id = window.setInterval(load, 120000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const text =
    err && !row
      ? "FEED_OFFLINE · Run Django API or set VITE_GITHUB_TOKEN for dev proxy"
      : row?.commit_message
        ? `${row.repository_name}  ·  ${row.commit_message}  ·  ${formatTs(row.commit_timestamp)}`
        : "SYNCING_GITHUB_FEED…";

  return (
    <div className="github-ticker" role="status" aria-live="polite">
      <div className="github-ticker__label-wrap">
        <div className="github-ticker__clock">{clock}</div>
        <div className="github-ticker__label">GitHub</div>
      </div>
      <div className="github-ticker__track">
        {err && !row ? (
          <span className="github-ticker__err">{text}</span>
        ) : (
          <div className="github-ticker__marquee">
            <span>
              <span className="github-ticker__sep">⟨</span> {text}{" "}
              <span className="github-ticker__sep">⟩</span>
              <span className="github-ticker__sep"> ··· </span>
            </span>
            <span>
              <span className="github-ticker__sep">⟨</span> {text}{" "}
              <span className="github-ticker__sep">⟩</span>
              <span className="github-ticker__sep"> ··· </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
