"use client";

import type { WindowState } from "../../lib/windowState";
import type { PortfolioProject } from "../../types/portfolio";
import ManagedWindow from "../os/ManagedWindow";
import { PropertiesTable, RetroButton } from "../os/ui";
import { useWindowManager } from "../os/WindowManager";
import { ProjectIconGraphic } from "./ProjectAppIcon";

/** Janela "Propriedades" do programa. */
export default function ProjectProperties({
  win,
  project,
}: {
  win: WindowState;
  project: PortfolioProject;
}) {
  const { close } = useWindowManager();

  return (
    <ManagedWindow
      win={win}
      width={380}
      variant="tool"
      offset={{ x: 420, y: 90 }}
      canMaximize={false}
    >
      <div className="flex items-center gap-3 border-b-2 border-steel pb-3">
        <ProjectIconGraphic icon={project.icon} size={40} />
        <div>
          <p className="font-pixel text-lg leading-none">{project.title}</p>
          <p className="mt-1 font-mono text-xs text-navy/70">{project.type}</p>
        </div>
      </div>
      <PropertiesTable
        className="mt-3"
        rows={[
          {
            label: "Local",
            value: (
              <span className="font-mono text-xs break-all">
                C:\Users\newt\Projetos\{project.id}.app
              </span>
            ),
          },
          { label: "Ano", value: project.year },
          { label: "Papel", value: project.role },
          { label: "Status", value: project.status },
          { label: "Telas", value: `${project.screenshots.length} arquivos` },
        ]}
      />
      <div className="mt-4 flex justify-end">
        <RetroButton variant="primary" onClick={() => close(win.key)}>
          OK
        </RetroButton>
      </div>
    </ManagedWindow>
  );
}
