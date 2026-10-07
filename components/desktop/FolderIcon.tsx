import { useId } from "react";

type FolderIconProps = {
  className?: string;
};

const SHEET_TRANSITION =
  "transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]";

/**
 * Pasta desenhada em SVG: fundo azul-escuro, folhas de papel que sobem no
 * hover (ou quando selecionada) e a frente azul royal.
 */
export default function FolderIcon({ className }: FolderIconProps) {
  const clipId = useId();

  return (
    <svg
      aria-hidden
      viewBox="0 0 64 56"
      className={`h-16 w-16 overflow-visible ${className ?? ""}`}
      strokeLinejoin="round"
    >
      {/* Fundo com a aba. */}
      <path
        d="M4 8 H24 L29 14 H60 V52 H4 Z"
        fill="var(--color-navy)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />

      {/* As folhas ficam recortadas no fundo da pasta: escondidas, elas
          descem para trás da frente sem vazar por baixo. */}
      <clipPath id={clipId}>
        <rect x="-10" y="-30" width="84" height="80" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <g
          className={`translate-y-[30px] group-hover:translate-y-0 group-aria-pressed:translate-y-0 ${SHEET_TRANSITION}`}
        >
          <g className="rotate-[9deg] [transform-box:fill-box] [transform-origin:bottom]">
            <rect
              x="29"
              y="-6"
              width="26"
              height="36"
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth="2.5"
            />
            <path
              d="M33 2 H50 M33 8 H46 M33 14 H50 M33 20 H44"
              stroke="var(--color-ink)"
              strokeWidth="2"
            />
          </g>
        </g>
        <g
          className={`translate-y-[32px] group-hover:translate-y-0 group-aria-pressed:translate-y-0 delay-50 ${SHEET_TRANSITION}`}
        >
          <g className="-rotate-[5deg] [transform-box:fill-box] [transform-origin:bottom]">
            <rect
              x="9"
              y="-3"
              width="28"
              height="36"
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth="2.5"
            />
            <path
              d="M13 5 H32 M13 11 H28 M13 17 H32 M13 23 H26"
              stroke="var(--color-royal)"
              strokeWidth="2.5"
            />
          </g>
        </g>
      </g>

      {/* Frente inclinada. */}
      <path
        d="M7 24 H62 L57 53 H2 Z"
        fill="var(--color-royal)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />
      <path d="M10 30 H22" stroke="var(--color-sky)" strokeWidth="3" />
    </svg>
  );
}
