"use client";

import type { MouseEvent } from "react";
import {
  useIconActivation,
  type OpenOrigin,
} from "../../lib/useIconActivation";
import type { PortfolioProject, ProjectIcon } from "../../types/portfolio";

const ICON_COLORS: Record<
  ProjectIcon["color"],
  { bar: string; glyph: string }
> = {
  royal: { bar: "var(--color-royal)", glyph: "var(--color-royal)" },
  navy: { bar: "var(--color-navy)", glyph: "var(--color-navy)" },
  sky: { bar: "var(--color-sky)", glyph: "var(--color-navy)" },
};

/**
 * Ícone do "programa". Usa a imagem própria do projeto quando existir;
 * senão desenha um ícone placeholder de software antigo com as iniciais.
 */
export function ProjectIconGraphic({
  icon,
  size = 48,
}: {
  icon: ProjectIcon;
  size?: number;
}) {
  if (icon.src) {
    return (
      <img
        src={icon.src}
        alt=""
        width={size}
        height={size}
        className="pixelated"
        draggable={false}
      />
    );
  }

  const colors = ICON_COLORS[icon.color];
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      shapeRendering="crispEdges"
    >
      <rect
        x="2"
        y="2"
        width="21"
        height="21"
        fill="var(--color-navy)"
        opacity="0.35"
      />
      <rect x="1" y="1" width="21" height="21" fill="var(--color-ink)" />
      <rect x="2" y="2" width="19" height="4" fill={colors.bar} />
      <rect x="17" y="3" width="3" height="2" fill="var(--color-paper)" />
      <rect x="2" y="7" width="19" height="14" fill="var(--color-paper)" />
      <text
        x="11.5"
        y="17.6"
        textAnchor="middle"
        fontSize="8.5"
        fill={colors.glyph}
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        {icon.glyph}
      </text>
    </svg>
  );
}

/** Aplicativo dentro do explorador de Projetos. */
export default function ProjectAppIcon({
  project,
  selected,
  onSelect,
  onOpen,
  onContextMenu,
  onPrefetch,
  onNewTabClick,
}: {
  project: PortfolioProject;
  selected: boolean;
  onSelect: () => void;
  onOpen: (origin: OpenOrigin) => void;
  onContextMenu: (event: MouseEvent) => void;
  /** Hover: já baixa a página do projeto. */
  onPrefetch: () => void;
  /** Ctrl/Cmd + clique ou clique do meio (abre em nova aba). */
  onNewTabClick: (event: MouseEvent) => void;
}) {
  const activation = useIconActivation({ onSelect, onOpen });

  return (
    <button
      type="button"
      {...activation}
      onClickCapture={onNewTabClick}
      onAuxClick={onNewTabClick}
      onPointerEnter={onPrefetch}
      onContextMenu={onContextMenu}
      aria-pressed={selected}
      aria-label={`${project.title}, ${project.type}. Duplo clique ou Enter para abrir.`}
      className="group flex w-full flex-col items-center gap-2 p-2 text-center"
    >
      <span
        className={`transition-transform duration-150 group-hover:-translate-y-0.5 ${
          selected ? "[filter:drop-shadow(2px_2px_0_var(--color-sky))]" : ""
        }`}
      >
        <ProjectIconGraphic icon={project.icon} />
      </span>
      <span
        className={`px-1 font-pixel text-sm leading-tight ${
          selected ? "bg-royal text-paper" : "text-ink group-hover:bg-mist"
        }`}
      >
        {project.title}
      </span>
      <span className="font-mono text-[10px] text-navy/60 uppercase">
        {project.type}
      </span>
    </button>
  );
}
