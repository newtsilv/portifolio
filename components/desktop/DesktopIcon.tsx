"use client";

import type { ReactNode } from "react";
import { useIconActivation } from "../../lib/useIconActivation";
import { Tooltip } from "../os/ui";

type DesktopIconProps = {
  label: string;
  icon: ReactNode;
  /** Texto do tooltip (caminho do arquivo). */
  hint: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  /** Hover/foco: o personagem comenta o ícone. */
  onHighlight?: (active: boolean) => void;
};

/**
 * Ícone do desktop. Mouse: clique seleciona, duplo clique abre. Toque: um
 * toque abre. Teclado: Enter abre.
 */
export default function DesktopIcon({
  label,
  icon,
  hint,
  selected,
  onSelect,
  onOpen,
  onHighlight,
}: DesktopIconProps) {
  const activation = useIconActivation({ onSelect, onOpen });

  return (
    <Tooltip label={hint} side="right">
      <button
        type="button"
        {...activation}
        aria-pressed={selected}
        aria-label={`${label} — abrir com duplo clique ou Enter`}
        onMouseEnter={() => onHighlight?.(true)}
        onMouseLeave={() => onHighlight?.(false)}
        onFocus={() => onHighlight?.(true)}
        onBlur={() => onHighlight?.(false)}
        className="group flex w-28 flex-col items-center gap-1.5 p-1.5 text-center focus-visible:outline-offset-0"
      >
        <span
          className={`grid h-16 w-16 place-items-center transition-transform duration-150 group-hover:-translate-y-0.5 ${
            selected ? "[&_svg]:drop-shadow-[2px_2px_0_var(--color-royal)]" : ""
          }`}
        >
          {icon}
        </span>
        <span
          className={`px-1 font-pixel text-sm leading-tight whitespace-nowrap ${
            selected
              ? "bg-royal text-paper outline outline-1 outline-dotted outline-paper"
              : "bg-paper/85 text-ink"
          }`}
        >
          {label}
        </span>
      </button>
    </Tooltip>
  );
}
