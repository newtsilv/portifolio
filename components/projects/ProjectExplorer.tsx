"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { findSection, projects } from "../../data/portfolio";
import {
  useIconActivation,
  type OpenOrigin,
} from "../../lib/useIconActivation";
import type { PortfolioProject } from "../../types/portfolio";
import type { WindowState } from "../../lib/windowState";
import ManagedWindow from "../os/ManagedWindow";
import { ContextMenu, MenuBar, type MenuItem } from "../os/Menus";
import PixelIcon from "../os/PixelIcon";
import { StatusBar } from "../os/ui";
import { useWindowManager } from "../os/WindowManager";
import { usePageTransition } from "../transition/PageTransition";
import ProjectAppIcon, { ProjectIconGraphic } from "./ProjectAppIcon";

type ViewMode = "icons" | "details";

const ADDRESS = findSection("projects")?.path ?? "C:\\Projetos\\";

/**
 * Pasta Projetos: um explorador de arquivos onde cada projeto é um
 * aplicativo. Clique seleciona (detalhes na barra de status), duplo clique
 * abre o programa na própria página dele (com a transição de "abrir
 * programa"), Ctrl/clique do meio abre em nova aba e o botão direito abre o
 * menu de contexto.
 */
export default function ProjectExplorer({ win }: { win: WindowState }) {
  const explorer = useProjectExplorer();
  return (
    <ManagedWindow
      win={win}
      width={680}
      height={460}
      menu={explorer.menuBar}
      statusBar={explorer.statusBar}
      bodyClassName=""
    >
      {explorer.body}
    </ManagedWindow>
  );
}

function useProjectExplorer() {
  const { open } = useWindowManager();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("icons");
  const [menu, setMenu] = useState<{ x: number; y: number; id: string } | null>(
    null,
  );
  const [notice, setNotice] = useState<string | null>(null);

  const selected =
    projects.find((project) => project.id === selectedId) ?? null;

  const router = useRouter();
  const { navigate } = usePageTransition();

  const hrefOf = (id: string) => `/projetos/${id}`;
  const openProject = (id: string, origin?: OpenOrigin) =>
    navigate(hrefOf(id), {
      ...(origin ? { origin } : {}),
      label: projects.find((project) => project.id === id)?.title ?? id,
    });
  const openInNewTab = (id: string) =>
    window.open(hrefOf(id), "_blank", "noopener");
  /** Ctrl/Cmd + clique ou clique do meio: nova aba, como num link. */
  const handleNewTabClick = (id: string) => (event: MouseEvent) => {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
      openInNewTab(id);
    }
  };
  const openProperties = (id: string) =>
    open({ kind: "properties", projectId: id });

  const menus: { label: string; items: MenuItem[] }[] = [
    {
      label: "Arquivo",
      items: [
        {
          label: "Abrir",
          hint: "Enter",
          disabled: !selected,
          onSelect: () => selected && openProject(selected.id),
        },
        {
          label: "Abrir em nova aba",
          disabled: !selected,
          onSelect: () => selected && openInNewTab(selected.id),
        },
        {
          label: "Propriedades",
          disabled: !selected,
          onSelect: () => selected && openProperties(selected.id),
        },
      ],
    },
    {
      label: "Editar",
      items: [
        {
          label: "Copiar caminho",
          onSelect: () => {
            void navigator.clipboard
              ?.writeText(ADDRESS)
              .then(() => setNotice("Caminho copiado"));
          },
        },
        {
          label: "Limpar seleção",
          disabled: !selected,
          onSelect: () => setSelectedId(null),
        },
      ],
    },
    {
      label: "Exibir",
      items: [
        {
          label: "Ícones",
          checked: view === "icons",
          onSelect: () => setView("icons"),
        },
        {
          label: "Detalhes",
          checked: view === "details",
          onSelect: () => setView("details"),
        },
      ],
    },
  ];

  return {
    menuBar: <MenuBar menus={menus} />,
    statusBar: (
      <StatusBar
        items={[
          `${projects.length} itens`,
          selected
            ? `Selecionado: ${selected.title} · ${selected.type} · ${selected.role} · ${selected.year}`
            : (notice ?? "Duplo clique (ou toque) abre um programa"),
          "Pronto",
        ]}
      />
    ),
    body: (
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-mist px-2 py-1.5">
          <span className="font-pixel text-xs text-navy uppercase">
            Endereço
          </span>
          <output className="flex min-w-0 flex-1 items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1 font-mono text-xs">
            <PixelIcon name="folder" size={14} />
            <span className="truncate">{ADDRESS}</span>
          </output>
        </div>

        {/* Clique no vazio limpa a seleção, como num explorador de verdade. */}
        <div
          className="flex-1 overflow-auto bg-paper p-3"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
        >
          {view === "icons" ? (
            <ul
              aria-label="Programas na pasta Projetos"
              className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2"
            >
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectAppIcon
                    project={project}
                    selected={project.id === selectedId}
                    onSelect={() => setSelectedId(project.id)}
                    onOpen={(origin) => openProject(project.id, origin)}
                    onPrefetch={() => router.prefetch(hrefOf(project.id))}
                    onNewTabClick={handleNewTabClick(project.id)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setSelectedId(project.id);
                      setMenu({
                        x: event.clientX,
                        y: event.clientY,
                        id: project.id,
                      });
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <DetailsView
              selectedId={selectedId}
              onSelect={setSelectedId}
              onOpen={openProject}
            />
          )}
        </div>

        {menu ? (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            label="Opções do projeto"
            onClose={() => setMenu(null)}
            items={[
              {
                label: "Abrir",
                onSelect: () => openProject(menu.id, { x: menu.x, y: menu.y }),
              },
              {
                label: "Abrir em nova aba",
                onSelect: () => openInNewTab(menu.id),
              },
              "separator",
              {
                label: "Propriedades",
                onSelect: () => openProperties(menu.id),
              },
            ]}
          />
        ) : null}
      </div>
    ),
  };
}

/** Modo "Detalhes": tabela com uma linha por programa. */
function DetailsView({
  selectedId,
  onSelect,
  onOpen,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (id: string, origin: OpenOrigin) => void;
}) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="font-pixel text-xs text-navy uppercase">
          {["Nome", "Tipo", "Papel", "Ano"].map((column, i) => (
            <th
              key={column}
              scope="col"
              className={`border-2 border-ink bg-mist px-2 py-1 font-normal ${i > 1 ? "hidden sm:table-cell" : ""}`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <DetailsRow
            key={project.id}
            project={project}
            selected={project.id === selectedId}
            onSelect={() => onSelect(project.id)}
            onOpen={(origin) => onOpen(project.id, origin)}
          />
        ))}
      </tbody>
    </table>
  );
}

function DetailsRow({
  project,
  selected,
  onSelect,
  onOpen,
}: {
  project: PortfolioProject;
  selected: boolean;
  onSelect: () => void;
  onOpen: (origin: OpenOrigin) => void;
}) {
  const activation = useIconActivation({ onSelect, onOpen });
  const cell = "border-b border-dashed border-steel px-2 py-1.5";

  return (
    <tr className={selected ? "bg-royal text-paper" : "hover:bg-mist"}>
      <td className={cell}>
        <button
          type="button"
          {...activation}
          aria-pressed={selected}
          className="flex items-center gap-2 text-left font-medium"
        >
          <ProjectIconGraphic icon={project.icon} size={20} />
          {project.title}
        </button>
      </td>
      <td className={`${cell} font-mono text-xs`}>{project.type}</td>
      <td className={`${cell} hidden sm:table-cell`}>{project.role}</td>
      <td className={`${cell} hidden font-mono text-xs sm:table-cell`}>
        {project.year}
      </td>
    </tr>
  );
}
