"use client";

import { motion, useDragControls } from "framer-motion";
import type { PointerEvent } from "react";
import type { PortfolioSection } from "../../types/portfolio";
import PortfolioSectionContent from "../portfolio/PortfolioSectionContent";

type DraggableWindowProps = {
  section: PortfolioSection;
  index: number;
  zIndex: number;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
};

export default function DraggableWindow({
  section,
  index,
  zIndex,
  onClose,
  onFocus,
}: DraggableWindowProps) {
  const dragControls = useDragControls();

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    onFocus(section.id);
    dragControls.start(event);
  }

  return (
    <motion.article
      className="absolute w-[min(680px,52vw)] overflow-hidden rounded-lg border-4 border-neutral-950 bg-[#f7f4ec] shadow-[10px_10px_0_#111]"
      style={{ left: 210 + index * 34, top: 82 + index * 38, zIndex }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={() => onFocus(section.id)}
      aria-label={`Janela ${section.title}`}
    >
      <div
        className="flex cursor-grab items-center justify-between border-b-4 border-neutral-950 bg-white px-5 py-3 active:cursor-grabbing"
        onPointerDown={startDrag}
      >
        <h2 className="font-black uppercase tracking-wide">{section.title}</h2>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-sm border-2 border-neutral-950 bg-white font-black shadow-[2px_2px_0_#111]"
          onClick={() => onClose(section.id)}
          aria-label={`Fechar ${section.title}`}
        >
          ×
        </button>
      </div>
      <div className="max-h-[58vh] overflow-auto bg-[#f7f4ec] p-6 text-base leading-relaxed">
        <PortfolioSectionContent sectionId={section.id} />
      </div>
    </motion.article>
  );
}
