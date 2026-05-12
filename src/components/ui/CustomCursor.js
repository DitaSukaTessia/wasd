"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // Target position (where finger/mouse is)
    let targetX = -100;
    let targetY = -100;

    // Ring's current interpolated position
    let ringX = -100;
    let ringY = -100;

    let visible = false;
    let rafId = null;
    let hideTimer = null;

    // Lerp factor — higher = snappier ring, lower = more floaty
    // 0.12 feels smooth but still has clear lag behind the dot
    const LERP = isTouchDevice ? 0.14 : 0.12;

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const setTarget = (x, y) => {
      targetX = x;
      targetY = y;
      // Dot snaps instantly to finger — GPU composited, no layout
      dot.style.transform = `translate(${x}px, ${y}px)`;
    };

    // rAF loop — runs every frame, lerps ring toward target
    const loop = () => {
      // Linear interpolation: ring creeps toward target each frame
      ringX += (targetX - ringX) * LERP;
      ringY += (targetY - ringY) * LERP;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(loop);
    };

    // ── Touch ───────────────────────────────────────────────────────
    const onTouchStart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      // Snap ring to finger on first touch — no lerp jump
      ringX = t.clientX;
      ringY = t.clientY;
      setTarget(t.clientX, t.clientY);
      show();
    };

    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (!t) return;
      setTarget(t.clientX, t.clientY);
      show();
    };

    const onTouchEnd = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 400);
    };

    // ── Mouse ───────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      setTarget(e.clientX, e.clientY);
      show();
    };

    const onMouseLeave = () => hide();
    const onMouseEnter = () => show();

    // Start the rAF loop immediately
    rafId = requestAnimationFrame(loop);

    if (isTouchDevice) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    } else {
      window.addEventListener("mousemove", onMouseMove);
      document.documentElement.addEventListener("mouseleave", onMouseLeave);
      document.documentElement.addEventListener("mouseenter", onMouseEnter);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(hideTimer);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Dot — fixed at 0,0, moved via transform only */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "rgba(79,110,247,0.9)",
          boxShadow: "0 0 8px rgba(79,110,247,0.6)",
          transform: "translate(-100px, -100px)",
          marginLeft: "-3px",
          marginTop: "-3px",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition: "opacity 0.2s ease",
          willChange: "transform",
        }}
      />

      {/* Ring — lerp-follows the dot via rAF */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1px solid rgba(79,110,247,0.4)",
          transform: "translate(-100px, -100px)",
          marginLeft: "-14px",
          marginTop: "-14px",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          transition: "opacity 0.2s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
