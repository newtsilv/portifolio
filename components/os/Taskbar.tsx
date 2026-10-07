"use client";

import { useState } from "react";
import { owner, portfolioSections } from "../../data/portfolio";
import { useClock } from "../../lib/useClock";
import { PopupMenu, type MenuItem } from "./Menus";
import PixelIcon from "./PixelIcon";
import { windowMeta } from "./windowMeta";
import { useWindowManager } from "./WindowManager";

/**
 * Taskbar fixa no rodapé: botão Iniciar, uma entrada por janela aberta
 * (clique alterna foco/minimizar) e a bandeja com o relógio.
 */
export default function Taskbar() {
  const { windows, activeKey, open, toggleFromTaskbar } = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const clock = useClock();

  const startItems: MenuItem[] = [
    ...portfolioSections.map((section) => ({
      label: section.title,
      onSelect: () => open({ kind: "section", id: section.id }),
    })),
    "separator",
    { label: "Leia-me.txt", onSelect: () => open({ kind: "readme" }) },
    { label: "Desligar…", onSelect: () => open({ kind: "shutdown" }) },
  ];

  const ordered = [...windows].sort((a, b) => a.seq - b.seq);

  return (
    <nav
      aria-label="Barra de tarefas"
      className="fixed inset-x-0 bottom-0 z-[1000] flex h-[var(--taskbar-h)] items-center gap-1.5 border-t-2 border-ink bg-paper px-1.5"
    >
      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={startOpen}
          onClick={() => setStartOpen((value) => !value)}
          className={`retro-press flex h-[calc(var(--taskbar-h)-0.6rem)] items-center gap-1.5 border-2 border-ink px-2 font-pixel text-sm uppercase shadow-[2px_2px_0_var(--color-navy)] ${
            startOpen ? "bg-royal text-paper" : "bg-mist hover:bg-sky"
          }`}
        >
          <PixelIcon name="computer" size={18} />
          Iniciar
        </button>

        {startOpen ? (
          <div className="absolute bottom-full left-0 mb-1.5 flex border-2 border-ink bg-paper shadow-[4px_4px_0_var(--color-navy)]">
            {/* Faixa lateral do menu Iniciar. */}
            <div
              aria-hidden
              className="flex w-8 items-end justify-center bg-royal pb-2"
            >
              <span className="font-pixel text-sm whitespace-nowrap text-paper [writing-mode:vertical-rl] rotate-180">
                {owner.shortName.toUpperCase()} OS
              </span>
            </div>
            <PopupMenu
              label="Menu Iniciar"
              items={startItems}
              onClose={() => setStartOpen(false)}
              className="border-0 shadow-none"
            />
          </div>
        ) : null}
      </div>

      <span aria-hidden className="h-6 w-px bg-steel" />

      <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {ordered.map((win) => {
          const meta = windowMeta(win.spec);
          const active = win.key === activeKey;
          return (
            <li key={win.key} className="shrink-0">
              <button
                type="button"
                onClick={() => toggleFromTaskbar(win.key)}
                aria-pressed={active}
                aria-label={`${meta.title}${win.minimized ? " (minimizada)" : ""}`}
                className={`flex h-[calc(var(--taskbar-h)-0.6rem)] max-w-44 items-center gap-1.5 border-2 px-2 font-pixel text-xs uppercase transition-colors duration-100 ${
                  active
                    ? "border-ink bg-mist shadow-[inset_2px_2px_0_var(--color-steel)]"
                    : "border-steel bg-paper hover:border-ink"
                } ${win.minimized ? "opacity-70" : ""}`}
              >
                <PixelIcon name={meta.icon} size={16} />
                <span className="hidden truncate sm:inline">{meta.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex h-[calc(var(--taskbar-h)-0.6rem)] shrink-0 items-center gap-2 border border-steel px-2 font-mono text-xs">
        <span
          aria-hidden
          className="hidden h-2 w-2 bg-royal sm:block"
          title="Online"
        />
        {clock ? (
          <time dateTime={clock.iso}>
            <span className="mr-2 hidden sm:inline">{clock.date}</span>
            {clock.time}
          </time>
        ) : (
          <span className="w-10" />
        )}
      </div>
    </nav>
  );
}
