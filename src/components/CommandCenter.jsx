import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const COMMANDS = [
  {
    id: "home",
    label: "Go to Shell / Home",
    match: ["home", "shell", ""],
    path: "/",
  },
  {
    id: "projects",
    label: "Open Projects grid",
    match: ["projects", "work", "grid"],
    path: "/projects",
  },
  {
    id: "github",
    label: "Github.com [sinxode]",
    match: ["github", "git"],
    href: "https://github.com/sinxode/",
  },
];

function normalize(s) {
  return s.trim().toLowerCase();
}

export default function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.match.some((m) => m.includes(q) || q.includes(m)) ||
        c.label.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const run = useCallback(
    (cmd) => {
      if (!cmd) return;
      if (cmd.path) {
        navigate(cmd.path);
        setOpen(false);
        setQuery("");
        return;
      }
      if (cmd.href) {
        window.open(cmd.href, "_blank", "noopener,noreferrer");
        setOpen(false);
        setQuery("");
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mm = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouchLike(mm.matches);
    update();
    if (typeof mm.addEventListener === "function") {
      mm.addEventListener("change", update);
      return () => mm.removeEventListener("change", update);
    }
    mm.addListener(update);
    return () => mm.removeListener(update);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`command-palette__launcher${isTouchLike ? " command-palette__launcher--visible" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open command center"
      >
        [ CMD ]
      </button>

      {open ? (
        <div
          className="command-palette-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Command center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="command-palette">
            <div className="command-palette__input-wrap">
              <span className="command-palette__prompt">&gt;</span>
              <input
                ref={inputRef}
                className="command-palette__input"
                placeholder="Type a command…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => Math.min(i + 1, filtered.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    run(filtered[active]);
                  }
                }}
              />
            </div>
            <ul className="command-palette__list">
              {filtered.map((c, idx) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`command-palette__item${idx === active ? " command-palette__item--active" : ""}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => run(c)}
                  >
                    <span>{c.label}</span>
                    <span className="command-palette__kbd">↵</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="command-palette__footer">
              {isTouchLike
                ? "Tap CMD · Esc to close"
                : "Ctrl+K · Esc to close · Arrows · Enter"}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
