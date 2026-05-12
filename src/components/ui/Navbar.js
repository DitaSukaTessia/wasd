"use client";

import { useApp } from "../../lib/AppContext";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⌂", requireRiddle: false },
  { id: "letter", label: "Surat", icon: "✉", requireRiddle: false },
  { id: "riddle", label: "Teka-teki", icon: "◈", requireRiddle: false },
  { id: "gift", label: "Hadiah", icon: "✦", requireRiddle: true },
  { id: "gallery", label: "Galeri", icon: "⊞", requireRiddle: true },
];

export default function Navbar() {
  const { currentPage, setCurrentPage, riddleSolved, launched } = useApp();

  if (!launched) return null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(7,8,13,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        className="max-w-3xl mx-auto px-5 flex items-center justify-between"
        style={{ height: "56px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            style={{
              fontSize: "11px",
              color: "rgba(79,110,247,0.5)",
              animation: "twinkle 2s ease-in-out infinite",
            }}
          >
            ✦
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            EKA<span style={{ color: "rgba(79,110,247,0.7)" }}>18</span>
          </span>
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const locked = item.requireRiddle && !riddleSolved;
            const active = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !locked && setCurrentPage(item.id)}
                title={locked ? "Selesaikan teka-teki dulu!" : item.label}
                disabled={locked}
                className="nav-item relative flex items-center gap-1.5 rounded-lg transition-all duration-200"
                style={{
                  padding: "6px 10px",
                  minHeight: "36px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  cursor: locked ? "not-allowed" : "pointer",
                  background: active ? "rgba(79,110,247,0.12)" : "transparent",
                  border: active
                    ? "1px solid rgba(79,110,247,0.3)"
                    : "1px solid transparent",
                  color: locked
                    ? "rgba(255,255,255,0.15)"
                    : active
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(255,255,255,0.35)",
                  boxShadow: active ? "0 0 12px rgba(79,110,247,0.1)" : "none",
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    fontSize: "17px",
                    color: locked
                      ? "rgba(255,255,255,0.12)"
                      : active
                        ? "rgba(79,110,247,0.9)"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </span>

                {/* Label — hidden on mobile */}
                <span className="hidden sm:inline">{item.label}</span>

                {/* Lock indicator */}
                {item.requireRiddle && (
                  <span className="absolute -top-1 -right-1">
                    <img
                      src={riddleSolved ? "/unlocked.svg" : "/lockedfix.svg"}
                      alt={riddleSolved ? "Unlocked" : "Locked"}
                      className="w-3 h-3"
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
        .nav-item:hover:not(:disabled) {
          background: rgba(79,110,247,0.07) !important;
          border-color: rgba(79,110,247,0.15) !important;
          color: rgba(255,255,255,0.65) !important;
        }
      `}</style>
    </nav>
  );
}
