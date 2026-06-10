"use client";

import { useState } from "react";
import { defaultGuideMessage, portfolioSections } from "../../data/portfolio";
import type { PortfolioSection } from "../../types/portfolio";
import CharacterGuide from "../character/CharacterGuide";
import DesktopIcon from "./DesktopIcon";
import DraggableWindow from "./DraggableWindow";

export default function DesktopPortfolio() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [guideMessage, setGuideMessage] = useState(defaultGuideMessage);
  const [topZIndex, setTopZIndex] = useState(20);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});

  function focusWindow(id: string) {
    setTopZIndex((current) => {
      const next = current + 1;
      setZIndexes((indexes) => ({ ...indexes, [id]: next }));
      return next;
    });
    setActiveWindow(id);
  }

  function openWindow(section: PortfolioSection) {
    setGuideMessage(section.message);
    setOpenWindows((current) =>
      current.includes(section.id) ? current : [...current, section.id],
    );
    focusWindow(section.id);
  }

  function closeWindow(id: string) {
    setOpenWindows((current) => current.filter((windowId) => windowId !== id));
    if (activeWindow === id) setActiveWindow(null);
  }

  return (
    <section className="relative min-h-screen overflow-hidden p-8">
      <div className="sketch-bg absolute inset-0" />
      <div className="absolute bottom-6 left-8 right-8 top-8 rotate-[-0.4deg] rounded-lg border-4 border-neutral-950 bg-white/40 shadow-[10px_10px_0_rgba(17,17,17,0.28)]" />

      <div className="relative z-10 flex w-fit flex-col gap-7">
        {portfolioSections.map((section) => (
          <DesktopIcon
            key={section.id}
            section={section}
            onOpen={openWindow}
            onGuideMessage={setGuideMessage}
          />
        ))}
      </div>

      {portfolioSections
        .filter((section) => openWindows.includes(section.id))
        .map((section, index) => (
          <DraggableWindow
            key={section.id}
            section={section}
            index={index}
            zIndex={zIndexes[section.id] ?? 20 + index}
            onClose={closeWindow}
            onFocus={focusWindow}
          />
        ))}

      <CharacterGuide message={guideMessage} />
    </section>
  );
}
