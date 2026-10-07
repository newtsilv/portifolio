"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Retrato desenhado só com o caractere "0": os zeros nascem nos pixels
 * escuros da imagem de origem e, ao passar o mouse (ou o dedo) por perto,
 * são empurrados para longe do ponteiro; sem interação eles vão sendo
 * puxados de volta pra posição original, como uma mola.
 */
type ZeroPortraitProps = {
  src: string;
  alt: string;
  /** Tamanho máximo do lado (px). O componente encolhe pra caber no container. */
  maxSize?: number;
  className?: string;
};

const SAMPLE_RES = 46; // resolução da grade de amostragem da imagem (menor = zeros maiores e mais esparsos)
const DARK_THRESHOLD = 140; // luminância abaixo disso conta como "tinta"
const REPEL_RADIUS = 26; // raio de influência do ponteiro, em px
const REPEL_FORCE = 320;
const SPRING = 0.09; // força que puxa cada zero de volta pra casa
const FRICTION = 0.82;

export default function ZeroPortrait({
  src,
  alt,
  maxSize = 300,
  className,
}: ZeroPortraitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [size, setSize] = useState(maxSize);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setSize(Math.min(width, maxSize));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [maxSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size <= 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;

    const image = new Image();
    image.src = src;
    image.onload = () => {
      if (cancelled) return;

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = SAMPLE_RES;
      sampleCanvas.height = SAMPLE_RES;
      const sampleCtx = sampleCanvas.getContext("2d");
      if (!sampleCtx) return;
      sampleCtx.drawImage(image, 0, 0, SAMPLE_RES, SAMPLE_RES);
      const { data } = sampleCtx.getImageData(0, 0, SAMPLE_RES, SAMPLE_RES);

      const cell = size / SAMPLE_RES;
      const homeX: number[] = [];
      const homeY: number[] = [];

      for (let gy = 0; gy < SAMPLE_RES; gy++) {
        for (let gx = 0; gx < SAMPLE_RES; gx++) {
          const idx = (gy * SAMPLE_RES + gx) * 4;
          const r = data[idx] ?? 255;
          const g = data[idx + 1] ?? 255;
          const b = data[idx + 2] ?? 255;
          const a = data[idx + 3] ?? 0;
          const luminance = (r + g + b) / 3;
          if (a > 40 && luminance < DARK_THRESHOLD) {
            homeX.push(gx * cell + cell / 2);
            homeY.push(gy * cell + cell / 2);
          }
        }
      }

      const count = homeX.length;
      const homeXArr = Float32Array.from(homeX);
      const homeYArr = Float32Array.from(homeY);
      const x = Float32Array.from(homeX);
      const y = Float32Array.from(homeY);
      const vx = new Float32Array(count);
      const vy = new Float32Array(count);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);
      ctx.font = `${Math.max(cell * 1.55, 5)}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f2a5f";

      function tick() {
        if (!ctx) return;
        ctx.clearRect(0, 0, size, size);
        const mouse = mouseRef.current;

        for (let i = 0; i < count; i++) {
          if (mouse.active) {
            const dx = x[i]! - mouse.x;
            const dy = y[i]! - mouse.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            if (dist < REPEL_RADIUS) {
              const force =
                ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE;
              vx[i]! += (dx / dist) * force * 0.0016;
              vy[i]! += (dy / dist) * force * 0.0016;
            }
          }

          vx[i]! += (homeXArr[i]! - x[i]!) * SPRING * 0.06;
          vy[i]! += (homeYArr[i]! - y[i]!) * SPRING * 0.06;
          vx[i]! *= FRICTION;
          vy[i]! *= FRICTION;
          x[i]! += vx[i]!;
          y[i]! += vy[i]!;

          ctx.fillText("0", x[i]!, y[i]!);
        }

        raf = requestAnimationFrame(tick);
      }

      raf = requestAnimationFrame(tick);
    };

    function toLocal(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * size,
        y: ((clientY - rect.top) / rect.height) * size,
      };
    }

    function onMove(event: PointerEvent) {
      const { x: lx, y: ly } = toLocal(event.clientX, event.clientY);
      mouseRef.current.x = lx;
      mouseRef.current.y = ly;
      mouseRef.current.active = true;
    }

    function onLeave() {
      mouseRef.current.active = false;
    }

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, [src, size]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={className ?? "mx-auto aspect-square w-full max-w-[280px]"}
    >
      <canvas ref={canvasRef} aria-hidden style={{ touchAction: "none" }} />
    </div>
  );
}
