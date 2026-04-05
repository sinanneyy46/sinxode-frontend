import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const CHANNELS = [
  { key: "call", label: "CALL", href: "tel:917356313515", hint: "tel" },
  {
    key: "wa",
    label: "WHATSAPP",
    href: "https://wa.me/917356313515?text=Connection%20Request%20to%20Sinxode",
    hint: "wa.me",
    external: true,
  },
  {
    key: "li",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/sinanneyy",
    hint: "in/sinanneyy",
    external: true,
  },
  {
    key: "gh",
    label: "GITHUB",
    href: "https://github.com/sinxode/",
    hint: "sinxode",
    external: true,
  },
  {
    key: "ig",
    label: "INSTAGRAM",
    href: "https://www.instagram.com/sinanneyy._/",
    hint: "@sinanneyy._",
    external: true,
  },
];

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function scrambleFrame(target, progress) {
  const len = target.length;
  const reveal = Math.floor(progress * len);
  let out = "";
  for (let i = 0; i < len; i += 1) {
    if (i < reveal) out += target[i];
    else if (target[i] === " ") out += " ";
    else out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return out;
}

export default function ContactPing() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [banner, setBanner] = useState("");
  const timerRef = useRef(null);

  const runSequence = useCallback((target, finalOpenState) => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBusy(true);
    setGlitch(true);
    if (!finalOpenState) setOpen(true);
    let frame = 0;
    const total = 18;
    timerRef.current = window.setInterval(() => {
      frame += 1;
      const p = frame / total;
      setBanner(scrambleFrame(target, p));
      if (frame >= total) {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setBanner("");
        setGlitch(false);
        setOpen(finalOpenState);
        setBusy(false);
      }
    }, 45);
  }, []);

  const runReveal = useCallback(() => {
    runSequence("SECURE_CHANNEL_ARMED", true);
  }, [runSequence]);

  const runClose = useCallback(() => {
    runSequence("CHANNEL_LINK_TERMINATED", false);
  }, [runSequence]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    [],
  );

  return (
    <aside
      className={`contact-ping${glitch ? " contact-ping--glitch" : ""}`}
      aria-label="Contact hub"
    >
      <div className="contact-ping__panel">
        <div className="contact-ping__header">
          <span className="contact-ping__label">Identity matrix</span>
          <div className="contact-ping__controls">
            {open ? (
              <button
                type="button"
                className="contact-ping__terminate"
                onClick={runClose}
                disabled={busy}
                aria-label="Terminate secure contact channel"
              >
                [ TERMINATE_LINK ]
              </button>
            ) : null}
            <span className="contact-ping__matrix">█▓▒░</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {banner ? (
            <motion.div
              key="banner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "var(--sx-font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                color: "var(--sx-neon-a)",
                marginBottom: "0.75rem",
                minHeight: "1.25rem",
              }}
            >
              {banner}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          className={`contact-ping__init${open ? " contact-ping__init--hidden" : ""}`}
          onClick={runReveal}
          disabled={busy}
        >
          [ INITIALIZE_SECURE_PING ]
        </button>

        <div
          className={`contact-ping__intel${open ? " contact-ping__intel--visible" : ""}`}
        >
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.key}
              href={c.href}
              className="contact-ping__link"
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <span>{c.label}</span>
              <span className="contact-ping__link-kbd">{c.hint}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </aside>
  );
}
