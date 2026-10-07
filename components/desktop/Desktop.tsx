"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  defaultGuideMessage,
  findProject,
  findSection,
  owner,
  portfolioSections,
} from "../../data/portfolio";
import type { WindowSpec, WindowState } from "../../lib/windowState";
import AboutApp from "../apps/AboutApp";
import ContactApp from "../apps/ContactApp";
import SkillsApp from "../apps/SkillsApp";
import { ReadmeNote, ResumeApp, ShutdownDialog } from "../apps/SystemApps";
import CharacterGuide from "../character/CharacterGuide";
import PixelIcon from "../os/PixelIcon";
import Taskbar from "../os/Taskbar";
import { useWindowManager, WindowManagerProvider } from "../os/WindowManager";
import ProjectExplorer from "../projects/ProjectExplorer";
import ProjectProperties from "../projects/ProjectProperties";
import DesktopIcon from "./DesktopIcon";
import FolderIcon from "./FolderIcon";

/**
 * A área de trabalho inteira: ícones, janelas, personagem e taskbar.
 * `initialWindows` permite abrir o desktop já com janelas (ex.: a rota
 * /projetos/[id] abre a pasta Projetos e o programa do projeto).
 */
export default function Desktop({
  initialWindows = [],
}: {
  initialWindows?: WindowSpec[];
}) {
  return (
    <WindowManagerProvider initialWindows={initialWindows}>
      <DesktopScreen />
    </WindowManagerProvider>
  );
}

const README_ID = "readme";

function DesktopScreen() {
  const { windows, activeKey, open, close, desktopRef } = useWindowManager();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [lastOpened, setLastOpened] = useState<string | null>(null);

  function openSection(id: string) {
    const section = findSection(id);
    if (!section) return;
    setSelected(id);
    setLastOpened(id);
    open({ kind: "section", id: section.id });
  }

  // Link antigo /?janela=projects (e afins) abre a janela correspondente.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("janela");
    if (findSection(id)) openSection(id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc fecha a janela em foco (quando o foco do teclado está dentro dela).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !activeKey) return;
      if (
        (document.activeElement as HTMLElement | null)?.closest("[role=dialog]")
      ) {
        close(activeKey);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeKey, close]);

  const guideSection = findSection(hovered ?? lastOpened);
  const guideMessage =
    hovered === README_ID
      ? "Se perder, abre o Leia-me. Eu deixei umas dicas lá."
      : (guideSection?.message ?? defaultGuideMessage);

  return (
    <div className="wallpaper fixed inset-0 overflow-hidden">
      <h1 className="sr-only">
        {owner.name} — {owner.role}. Portfólio em forma de computador pessoal.
      </h1>

      <div
        ref={desktopRef}
        className="absolute inset-x-0 top-0 bottom-[var(--taskbar-h)]"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        {/* Marca d'água do papel de parede. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-4 select-none md:bottom-8 md:left-8"
        >
          <p className="font-pixel text-5xl leading-none text-royal/15 md:text-8xl">
            {owner.shortName.toUpperCase()} OS
          </p>
          <p className="mt-2 font-mono text-xs text-navy/60 md:text-sm">
            {owner.name} · {owner.role}
          </p>
        </div>

        <nav aria-label="Área de trabalho" className="relative z-[1]">
          <ul className="grid grid-cols-3 justify-items-center gap-y-3 px-2 pt-4 sm:grid-cols-4 lg:w-max lg:grid-flow-col lg:grid-cols-none lg:grid-rows-5 lg:justify-items-start lg:gap-x-2 lg:gap-y-1 lg:px-3 lg:pt-3">
            {portfolioSections.map((section) => (
              <li key={section.id}>
                <DesktopIcon
                  label={section.title}
                  hint={section.path}
                  icon={
                    section.id === "projects" ? (
                      <FolderIcon />
                    ) : (
                      <PixelIcon name={section.icon} size={48} />
                    )
                  }
                  selected={selected === section.id}
                  onSelect={() => setSelected(section.id)}
                  onOpen={() => openSection(section.id)}
                  onHighlight={(active) =>
                    setHovered(active ? section.id : null)
                  }
                />
              </li>
            ))}
            <li>
              <DesktopIcon
                label="Leia-me.txt"
                hint="C:\Users\newt\Desktop\leia-me.txt"
                icon={<PixelIcon name="note" size={48} />}
                selected={selected === README_ID}
                onSelect={() => setSelected(README_ID)}
                onOpen={() => {
                  setSelected(README_ID);
                  open({ kind: "readme" });
                }}
                onHighlight={(active) => setHovered(active ? README_ID : null)}
              />
            </li>
          </ul>
        </nav>

        <CharacterGuide message={guideMessage} />

        <AnimatePresence>
          {windows.map((win) => (
            <WindowContent key={win.key} win={win} />
          ))}
        </AnimatePresence>
      </div>

      <Taskbar />
    </div>
  );
}

/** Escolhe o "programa" certo para cada janela aberta. */
function WindowContent({ win }: { win: WindowState }) {
  const { spec } = win;

  switch (spec.kind) {
    case "section":
      switch (spec.id) {
        case "about":
          return <AboutApp win={win} />;
        case "projects":
          return <ProjectExplorer win={win} />;
        case "skills":
          return <SkillsApp win={win} />;
        case "contact":
          return <ContactApp win={win} />;
        case "resume":
          return <ResumeApp win={win} />;
      }
      return null;
    case "properties": {
      const project = findProject(spec.projectId);
      return project ? <ProjectProperties win={win} project={project} /> : null;
    }
    case "readme":
      return <ReadmeNote win={win} />;
    case "shutdown":
      return <ShutdownDialog win={win} />;
  }
}
