"use client";

import { useState } from "react";
import { skillCategories, skills } from "../../data/portfolio";
import type { WindowState } from "../../lib/windowState";
import type { SkillCategory } from "../../types/portfolio";
import ManagedWindow from "../os/ManagedWindow";
import PixelIcon from "../os/PixelIcon";
import { StatusBar } from "../os/ui";

type Filter = SkillCategory | "all";

/**
 * Skills como "programas instalados": árvore de pastas à esquerda, lista de
 * softwares à direita. Sem barras de porcentagem.
 */
export default function SkillsApp({ win }: { win: WindowState }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible =
    filter === "all"
      ? skills
      : skills.filter((skill) => skill.category === filter);
  const path = filter === "all" ? "C:\\skills\\" : `C:\\skills\\${filter}\\`;

  const folders: { id: Filter; label: string }[] = [
    { id: "all", label: "skills" },
    ...skillCategories.map((category) => ({
      id: category.id,
      label: category.label,
    })),
  ];

  return (
    <ManagedWindow
      win={win}
      width={700}
      height={440}
      bodyClassName=""
      statusBar={
        <StatusBar items={[`${visible.length} programas instalados`, path]} />
      }
    >
      <div className="flex h-full flex-col md:flex-row">
        <nav
          aria-label="Pastas de skills"
          className="shrink-0 border-b-2 border-ink bg-mist p-2 md:w-44 md:border-r-2 md:border-b-0"
        >
          <p className="mb-1 hidden px-1 font-pixel text-xs text-navy uppercase md:block">
            Pastas
          </p>
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {folders.map((folder, i) => {
              const active = folder.id === filter;
              return (
                <li key={folder.id} className={i > 0 ? "md:pl-4" : ""}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(folder.id)}
                    className={`flex min-h-9 w-full items-center gap-1.5 px-1.5 font-mono text-xs whitespace-nowrap ${
                      active ? "bg-royal text-paper" : "hover:bg-paper"
                    }`}
                  >
                    <PixelIcon name="folder" size={16} />
                    {i === 0 ? "C:\\skills" : folder.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 overflow-auto p-3">
          <p className="mb-2 font-pixel text-sm text-royal uppercase">
            Programas instalados
          </p>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="font-pixel text-xs text-navy uppercase">
                <th
                  scope="col"
                  className="border-2 border-ink bg-mist px-2 py-1 font-normal"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="hidden border-2 border-ink bg-mist px-2 py-1 font-normal sm:table-cell"
                >
                  Descrição
                </th>
                <th
                  scope="col"
                  className="border-2 border-ink bg-mist px-2 py-1 font-normal"
                >
                  Pasta
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((skill) => (
                <tr key={skill.name} className="hover:bg-mist">
                  <td className="border-b border-dashed border-steel px-2 py-1.5">
                    <span className="flex items-center gap-2 font-semibold">
                      <PixelIcon name="app" size={18} />
                      {skill.name}
                    </span>
                  </td>
                  <td className="hidden border-b border-dashed border-steel px-2 py-1.5 sm:table-cell">
                    {skill.note}
                  </td>
                  <td className="border-b border-dashed border-steel px-2 py-1.5 font-mono text-xs text-navy/70">
                    \{skill.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagedWindow>
  );
}
