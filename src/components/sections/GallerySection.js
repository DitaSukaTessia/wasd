"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ================= DATA =================
const INITIAL_PHOTOS = [
  { id: 1, src: "/assets/example.png" },
  { id: 2, src: "/assets/example.png" },
  { id: 3, src: "/assets/example.png" },
  { id: 4, src: "/assets/example.png" },
  { id: 5, src: "/assets/example.png" },
  { id: 6, src: "/assets/example.png" },
  { id: 7, src: "/assets/example.png" },
  { id: 8, src: "/assets/example.png" },
];

const getSizeStyle = (index, isMobile) => {
  const variants = [
    { ratio: 1 },
    { ratio: 1.5 },
    { ratio: 0.75 },
    { ratio: 1.25 },
    { ratio: 1 },
    { ratio: 1.75 },
    { ratio: 0.85 },
  ];
  const h = isMobile ? 110 : 160;
  const { ratio } = variants[index % variants.length];
  return {
    height: `${h}px`,
    width: `${Math.round(h * ratio)}px`,
    flexShrink: 0,
  };
};

// ================= PHOTO ITEM =================
function PhotoItem({ photo, onClick, index, isMobile }) {
  const [active, setActive] = useState(false);
  const sizeStyle = getSizeStyle(index, isMobile);

  // FIX #4: Responsive tap feedback — gunakan onPointerEnter/Leave
  // agar hover state bekerja di desktop, dan tap di mobile tetap responsif
  return (
    <div
      style={sizeStyle}
      className="cursor-pointer relative overflow-hidden group"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onClick={() => onClick()}
    >
      <img
        src={photo.src}
        // FIX #6: alt text yang meaningful
        alt={`Photo ${index + 1}`}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          active ? "grayscale-0 scale-[1.08]" : "grayscale"
        }`}
        draggable={false}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          active ? "opacity-0" : "opacity-30"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

// ================= ROW =================
function Row({ items, direction = "left", onClick, rowIndex, isMobile }) {
  const ref = useRef(null);
  const requestRef = useRef();
  const xRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartTranslate = useRef(0);
  // FIX #3: Track apakah ini drag horizontal atau vertical
  const dragAxis = useRef(null); // null | "horizontal" | "vertical"

  const infiniteItems = [...items, ...items, ...items];
  const speed = isMobile ? 0.25 : 0.35;

  useEffect(() => {
    const animate = () => {
      if (!isDragging.current && ref.current) {
        xRef.current += direction === "left" ? -speed : speed;
        const totalWidth = ref.current.scrollWidth / 3;
        if (xRef.current <= -totalWidth) xRef.current += totalWidth;
        else if (xRef.current >= 0) xRef.current -= totalWidth;
        ref.current.style.transform = `translateX(${xRef.current}px)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [direction, speed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      dragAxis.current = "horizontal";
      dragStartX.current = e.pageX;
      dragStartTranslate.current = xRef.current;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.pageX - dragStartX.current;
      let t = dragStartTranslate.current + dx;
      const totalWidth = el.scrollWidth / 3;
      if (t <= -totalWidth) t += totalWidth;
      if (t >= 0) t -= totalWidth;
      xRef.current = t;
      el.style.transform = `translateX(${xRef.current}px)`;
    };
    const onMouseUp = () => {
      isDragging.current = false;
      dragAxis.current = null;
      el.style.cursor = "grab";
    };

    // FIX #3: Touch dengan deteksi arah — block page scroll saat horizontal drag
    const onTouchStart = (e) => {
      isDragging.current = true;
      dragAxis.current = null; // belum tahu arahnya
      dragStartX.current = e.touches[0].pageX;
      dragStartY.current = e.touches[0].pageY;
      dragStartTranslate.current = xRef.current;
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;

      const dx = e.touches[0].pageX - dragStartX.current;
      const dy = e.touches[0].pageY - dragStartY.current;

      // Tentukan axis di gerakan pertama
      if (dragAxis.current === null) {
        dragAxis.current =
          Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }

      // Kalau horizontal, prevent scroll page
      if (dragAxis.current === "horizontal") {
        e.preventDefault();
        let t = dragStartTranslate.current + dx;
        const totalWidth = el.scrollWidth / 3;
        if (t <= -totalWidth) t += totalWidth;
        if (t >= 0) t -= totalWidth;
        xRef.current = t;
        el.style.transform = `translateX(${xRef.current}px)`;
      }
      // Kalau vertical, biarkan page scroll berjalan normal
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      dragAxis.current = null;
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    // FIX #3: passive: false agar bisa preventDefault() saat horizontal
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div
        ref={ref}
        className="flex cursor-grab select-none"
        // FIX #5: gap antar row sedikit lebih besar di mobile
        style={{ gap: isMobile ? "10px" : "12px", willChange: "transform" }}
      >
        {infiniteItems.map((p, i) => (
          <PhotoItem
            key={`${p.id}-${rowIndex}-${i}`}
            photo={p}
            onClick={() => onClick(p)}
            index={i}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}

// ================= MODAL =================
function Modal({ photo, onClose }) {
  // FIX #8: Swipe-to-close di mobile
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    // Swipe down lebih dari 80px dan dominan vertical → tutup modal
    if (dy > 80 && dx < 60) onClose();
    touchStartY.current = null;
    touchStartX.current = null;
  };

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe hint indicator — hanya tampil di mobile */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 sm:hidden"
        style={{
          width: "36px",
          height: "4px",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.25)",
        }}
      />

      <div
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mt-4 text-[11px] text-white/50 font-exo tracking-wide">
          tip: Ketuk bagian kosong untuk keluar
        </p>

        <img
          src={photo.src}
          className="block max-h-[80vh] max-w-[90vw] sm:max-h-[85vh] sm:max-w-[85vw] object-contain"
          style={{ boxShadow: "0 0 80px rgba(255, 252, 252, 0)" }}
          alt="Full size photo"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center justify-center rounded-full text-white/60 hover:text-white transition-colors duration-200"
        style={{
          width: "32px",
          height: "32px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontSize: "12px",
        }}
        aria-label="Tutup foto"
      >
        ✕
      </button>
    </div>
  );
}

// ================= UPLOAD BUTTON =================
function UploadButton({ onUpload }) {
  return (
    <label
      className="fixed right-4 z-40 flex items-center gap-2 cursor-pointer rounded-full text-white/50 hover:text-white/80 transition-colors duration-200"
      style={{
        // FIX #2: Safe area inset untuk iPhone notch/home bar
        bottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "8px 14px",
        fontSize: "11px",
        letterSpacing: "0.12em",
        backdropFilter: "blur(8px)",
      }}
    >
      <span style={{ fontSize: "14px" }}>+</span>
      <span className="sm:inline font-mono">UPLOAD</span>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
    </label>
  );
}

// ================= MAIN =================
export default function Gallery() {
  // FIX #7: Track object URLs untuk cleanup
  const objectURLsRef = useRef([]);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // FIX #7: Revoke semua object URLs saat komponen unmount
  useEffect(() => {
    return () => {
      objectURLsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file, i) => {
      const src = URL.createObjectURL(file);
      // FIX #7: Simpan URL untuk di-revoke nanti
      objectURLsRef.current.push(src);
      return { id: Date.now() + i, src };
    });
    setPhotos((prev) => [...newPhotos, ...prev]);
    // Reset input agar file yang sama bisa di-upload lagi
    e.target.value = "";
  };

  // FIX #10: State kosong fallback (edge case)
  const isEmpty = photos.length === 0;

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "#0a0a0a",
        // FIX #1: Pakai CSS variable-friendly approach, bukan hardcode 80px
        // Gunakan padding-top yang lebih aman, sesuaikan dengan navbar di layout parent
        paddingTop: "80px",
      }}
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* HEADER */}
      <header className="relative px-5 sm:px-10 md:px-16 pb-4 sm:pb-6">
        <h1
          aria-hidden="true"
          className="font-cinzel font-bold leading-none tracking-tighter select-none"
          style={{
            fontSize: "clamp(52px, 18vw, 140px)",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.07)",
            marginBottom: "-0.05em",
          }}
        >
          EKA
        </h1>

        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "12px",
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 sm:gap-0">
          <p
            className="font-exo text-gray-400"
            style={{
              fontSize: "clamp(12px, 1.6vw, 15px)",
              letterSpacing: "0.04em",
            }}
          >
            there's your random pict about you
          </p>
          {/* FIX #9: Teks adaptif — "ketuk" di mobile, "klik" di desktop */}
          <p
            className="font-cinzel text-gray-600"
            style={{ fontSize: "9px", letterSpacing: "0.22em" }}
          >
            {photos.length} FOTO&nbsp;&nbsp;·&nbsp;&nbsp;
            <span className="sm:hidden">KETUK</span>
            <span className="hidden sm:inline">KLIK</span> UNTUK MEMBUKA PENUH
          </p>
        </div>
      </header>

      {/* GALLERY ROWS atau EMPTY STATE */}
      {isEmpty ? (
        // FIX #10: Empty state
        <div
          className="flex flex-col items-center justify-center py-24 px-8 text-center"
          style={{ gap: "12px" }}
        >
          <p
            className="font-cinzel text-gray-600"
            style={{ fontSize: "10px", letterSpacing: "0.25em" }}
          >
            BELUM ADA FOTO
          </p>
          <p className="font-exo text-gray-700" style={{ fontSize: "13px" }}>
            Upload foto pertamamu di bawah
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "10px" : "16px",
            paddingTop: isMobile ? "12px" : "20px",
            paddingBottom: isMobile ? "80px" : "60px",
          }}
        >
          <Row
            items={photos}
            direction="left"
            onClick={setSelected}
            rowIndex={0}
            isMobile={isMobile}
          />
          <Row
            items={photos}
            direction="right"
            onClick={setSelected}
            rowIndex={1}
            isMobile={isMobile}
          />
          <Row
            items={photos}
            direction="left"
            onClick={setSelected}
            rowIndex={2}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* FOOTER */}
      <footer
        className="relative px-5 sm:px-10 md:px-16 py-5 sm:py-14"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          aria-hidden="true"
          className="absolute right-5 sm:right-10 md:right-16 top-1/2 -translate-y-1/2 font-cinzel font-bold select-none pointer-events-none"
          style={{
            fontSize: "clamp(36px, 10vw, 88px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.07)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          GALLERY
        </span>

        <div className="relative flex flex-col gap-4">
          <p
            className="font-cinzel text-gray-600"
            style={{ fontSize: "9px", letterSpacing: "0.25em" }}
          >
            MADE WITH LOVE
          </p>
          <p
            className="font-exo text-white/70"
            style={{
              fontSize: "clamp(13px, 1.8vw, 15px)",
              letterSpacing: "0.04em",
            }}
          >
            crafted by{" "}
            <span className="text-white/90" style={{ fontStyle: "italic" }}>
              ditaputra
            </span>
          </p>
          <p
            className="font-cinzel text-gray-600"
            style={{ fontSize: "9px", letterSpacing: "0.2em" }}
          >
            {new Date().getFullYear()} · FOR EKA MEILANI
          </p>
        </div>
      </footer>

      <UploadButton onUpload={handleUpload} />
      <Modal photo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
