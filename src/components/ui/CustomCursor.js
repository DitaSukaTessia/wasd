"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;

    let visible = false;
    let rafId = null;

    const LERP = 0.12;

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
      dot.style.transform = `translate(${x}px, ${y}px)`;
    };

    const loop = () => {
      ringX += (targetX - ringX) * LERP;
      ringY += (targetY - ringY) * LERP;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(loop);
    };

    const onMouseMove = (e) => {
      setTarget(e.clientX, e.clientY);
      show();
    };

    const onMouseLeave = hide;
    const onMouseEnter = show;

    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mounted, isTouchDevice]);

  if (!mounted || isTouchDevice) return null;

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
