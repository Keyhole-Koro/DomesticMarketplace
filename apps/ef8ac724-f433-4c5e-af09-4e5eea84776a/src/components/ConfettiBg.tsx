// components/ConfettiBg.tsx
import React from "react";

type Shape =
  | { kind: "circle"; size: number; color: string; x: string; y: string; blur?: number; opacity?: number; hollow?: boolean; rotate?: number }
  | { kind: "square"; size: number; color: string; x: string; y: string; blur?: number; opacity?: number; rotate?: number }
  | { kind: "tri"; size: number; color: string; x: string; y: string; blur?: number; opacity?: number; rotate?: number }
  | { kind: "plus"; size: number; color: string; x: string; y: string; blur?: number; opacity?: number; rotate?: number }
  | { kind: "dash"; w: number; h: number; color: string; x: string; y: string; blur?: number; opacity?: number; rotate?: number };

const CONFETTI_COLORS = {
  orange: "#FF9C00",
  yellow: "#FFD828",
  blue: "#8AB0DF",
  mint: "#98E7CB",
} as const;

const shapes: Shape[] = [
  // 上の方
  { kind: "circle", size: 42, color: CONFETTI_COLORS.orange, x: "8%", y: "6%", blur: 1.6, opacity: 0.75 },
  { kind: "plus", size: 34, color: CONFETTI_COLORS.blue, x: "52%", y: "4%", blur: 1.2, opacity: 0.7 },
  { kind: "tri", size: 38, color: CONFETTI_COLORS.mint, x: "86%", y: "7%", blur: 1.4, opacity: 0.7 },
  { kind: "square", size: 34, color: CONFETTI_COLORS.orange, x: "72%", y: "16%", blur: 1.2, opacity: 0.8, rotate: 12 },
  { kind: "circle", size: 44, color: CONFETTI_COLORS.yellow, x: "90%", y: "20%", blur: 1.6, opacity: 0.7 },
  { kind: "tri", size: 34, color: CONFETTI_COLORS.mint, x: "25%", y: "18%", blur: 1.8, opacity: 0.55, rotate: -12 },
  { kind: "dash", w: 34, h: 8, color: CONFETTI_COLORS.blue, x: "6%", y: "26%", blur: 1.6, opacity: 0.55, rotate: -16 },

  // 真ん中
  { kind: "square", size: 34, color: CONFETTI_COLORS.yellow, x: "47%", y: "28%", blur: 1.8, opacity: 0.6, rotate: -6 },
  { kind: "circle", size: 30, color: CONFETTI_COLORS.blue, x: "78%", y: "34%", blur: 1.4, opacity: 0.6, hollow: true },
  { kind: "circle", size: 30, color: CONFETTI_COLORS.blue, x: "10%", y: "40%", blur: 1.4, opacity: 0.6, hollow: true },
  { kind: "circle", size: 28, color: CONFETTI_COLORS.yellow, x: "49%", y: "39%", blur: 1.2, opacity: 0.75, hollow: true },
  { kind: "square", size: 30, color: CONFETTI_COLORS.mint, x: "40%", y: "52%", blur: 1.8, opacity: 0.55, rotate: 10 },
  { kind: "plus", size: 34, color: CONFETTI_COLORS.mint, x: "58%", y: "63%", blur: 1.4, opacity: 0.65, rotate: 8 },
  { kind: "square", size: 34, color: CONFETTI_COLORS.orange, x: "80%", y: "56%", blur: 1.2, opacity: 0.8, rotate: 18 },

  // 下の方
  { kind: "circle", size: 46, color: CONFETTI_COLORS.yellow, x: "12%", y: "72%", blur: 1.8, opacity: 0.75 },
  { kind: "tri", size: 38, color: CONFETTI_COLORS.mint, x: "88%", y: "74%", blur: 1.4, opacity: 0.7, rotate: 10 },
  { kind: "circle", size: 46, color: CONFETTI_COLORS.blue, x: "49%", y: "78%", blur: 2.2, opacity: 0.55 },
  { kind: "circle", size: 28, color: CONFETTI_COLORS.orange, x: "78%", y: "84%", blur: 1.4, opacity: 0.7, hollow: true },
  { kind: "circle", size: 30, color: CONFETTI_COLORS.blue, x: "10%", y: "86%", blur: 1.4, opacity: 0.6, hollow: true },
  { kind: "dash", w: 34, h: 8, color: CONFETTI_COLORS.blue, x: "22%", y: "90%", blur: 1.6, opacity: 0.55, rotate: 14 },
  { kind: "square", size: 34, color: CONFETTI_COLORS.yellow, x: "92%", y: "92%", blur: 1.8, opacity: 0.6, rotate: -10 },
  { kind: "tri", size: 34, color: CONFETTI_COLORS.mint, x: "63%", y: "93%", blur: 1.8, opacity: 0.5, rotate: -6 },
  { kind: "circle", size: 44, color: CONFETTI_COLORS.yellow, x: "18%", y: "98%", blur: 1.8, opacity: 0.7 },
];

function ShapeEl(s: Shape, i: number) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: s.x,
    top: s.y,
    opacity: s.opacity ?? 0.65,
    filter: `blur(${s.blur ?? 1.5}px)`,
    transform: `translate(-50%, -50%) rotate(${(s as any).rotate ?? 0}deg)`,
    willChange: "transform",
  };

  // ほんの少し“ゆらぎ”をつける（画像のふわ感）
  const floatClass = `confetti-float confetti-float-${(i % 4) + 1}`;

  if (s.kind === "circle") {
    return (
      <div
        key={i}
        className={floatClass}
        style={{
          ...baseStyle,
          width: s.size,
          height: s.size,
          borderRadius: 999,
          background: s.hollow ? "transparent" : s.color,
          border: s.hollow ? `6px solid ${s.color}` : undefined,
        }}
      />
    );
  }

  if (s.kind === "square") {
    return (
      <div
        key={i}
        className={floatClass}
        style={{
          ...baseStyle,
          width: s.size,
          height: s.size,
          background: s.color,
          borderRadius: 6,
        }}
      />
    );
  }

  if (s.kind === "tri") {
    const size = s.size;
    return (
      <div
        key={i}
        className={floatClass}
        style={{
          ...baseStyle,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${s.color}`,
        }}
      />
    );
  }

  if (s.kind === "plus") {
    const w = s.size;
    const t = Math.max(6, Math.round(s.size / 5));
    return (
      <div key={i} className={floatClass} style={{ ...baseStyle, width: w, height: w }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: t,
            height: w,
            transform: "translateX(-50%)",
            background: s.color,
            borderRadius: 999,
            filter: `blur(${s.blur ?? 1.5}px)`,
            opacity: s.opacity ?? 0.65,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: w,
            height: t,
            transform: "translateY(-50%)",
            background: s.color,
            borderRadius: 999,
            filter: `blur(${s.blur ?? 1.5}px)`,
            opacity: s.opacity ?? 0.65,
          }}
        />
      </div>
    );
  }

  // dash
  return (
    <div
      key={i}
      className={floatClass}
      style={{
        ...baseStyle,
        width: s.w,
        height: s.h,
        background: s.color,
        borderRadius: 999,
      }}
    />
  );
}

export function ConfettiBg() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {shapes.map(ShapeEl)}
    </div>
  );
}
