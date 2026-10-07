"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../../types/portfolio";
import PixelIcon from "../os/PixelIcon";

/**
 * Screenshot de projeto. Com `src`, mostra a imagem e uma barrinha de
 * "LOADING" só enquanto ela realmente carrega (sem atraso artificial).
 * Sem `src`, desenha um placeholder de arquivo.
 */
export default function ProjectImageFrame({
  image,
  className,
  fit = "cover",
}: {
  image: ProjectImage;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Imagem já em cache: `onLoad` pode ter disparado antes da hidratação.
  useEffect(() => {
    setLoaded(Boolean(imgRef.current?.complete));
  }, [image.src]);

  return (
    <div
      className={`relative overflow-hidden border-2 border-ink bg-mist ${className ?? ""}`}
    >
      {image.src ? (
        <>
          <img
            ref={imgRef}
            src={image.src}
            alt={image.alt}
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${
              fit === "cover" ? "object-cover" : "object-contain"
            } ${loaded ? "opacity-100" : "opacity-0"}`}
          />
          {!loaded ? <LoadingBar label="Carregando imagem" /> : null}
        </>
      ) : (
        <div
          role="img"
          aria-label={`Espaço reservado: ${image.alt}`}
          className="placeholder-hatch absolute inset-0 grid place-items-center p-4 text-center"
        >
          <div className="flex flex-col items-center gap-2">
            <PixelIcon name="image" size={32} />
            <p className="font-pixel text-sm text-navy uppercase">
              [Captura de tela]
            </p>
            <p className="font-mono text-[11px] text-navy/70">{image.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function LoadingBar({ label = "Carregando" }: { label?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      className="absolute inset-0 grid place-items-center bg-mist p-4"
    >
      <div className="w-full max-w-56">
        <p className="mb-1.5 font-pixel text-xs text-navy uppercase">
          {label}…
        </p>
        <div className="h-4 border-2 border-ink bg-paper p-0.5">
          <div className="retro-progress h-full" />
        </div>
      </div>
    </div>
  );
}
