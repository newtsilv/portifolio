"use client";

import { defaultGuideMessage } from "../../data/portfolio";
import type { PortfolioSection } from "../../types/portfolio";

type DesktopIconProps = {
  section: PortfolioSection;
  onOpen: (section: PortfolioSection) => void;
  onGuideMessage: (message: string) => void;
};

export default function DesktopIcon({
  section,
  onOpen,
  onGuideMessage,
}: DesktopIconProps) {
  return (
    <button
      type="button"
      className="group flex w-24 flex-col items-center gap-2 rounded-md p-2 text-center transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-neutral-950/20"
      onClick={() => onOpen(section)}
      onMouseEnter={() => onGuideMessage(section.message)}
      onFocus={() => onGuideMessage(section.message)}
      onMouseLeave={() => onGuideMessage(defaultGuideMessage)}
      onBlur={() => onGuideMessage(defaultGuideMessage)}
      aria-label={`Abrir ${section.title}`}
    >
      <span className="grid h-14 w-16 -rotate-2 place-items-center rounded-md border-4 border-neutral-950 bg-white text-2xl shadow-[5px_5px_0_#111] transition group-hover:rotate-1">
        {section.icon}
      </span>
      <span className="rounded-sm border-2 border-neutral-950 bg-white px-2 py-1 text-xs font-black shadow-[3px_3px_0_#111]">
        {section.title}
      </span>
    </button>
  );
}
