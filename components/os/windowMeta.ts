import { findProject, findSection } from "../../data/portfolio";
import type { WindowSpec } from "../../lib/windowState";
import type { PixelIconName } from "../../types/portfolio";

/** "Educational Platform" → "EDUCATIONAL_PLATFORM". */
export function toWindowTitle(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();
}

/** Título e ícone de uma janela (barra de título e taskbar). */
export function windowMeta(spec: WindowSpec): {
  title: string;
  icon: PixelIconName;
} {
  switch (spec.kind) {
    case "section": {
      const section = findSection(spec.id);
      return {
        title: section?.windowTitle ?? spec.id,
        icon: section?.icon ?? "app",
      };
    }
    case "properties": {
      const project = findProject(spec.projectId);
      return { title: `Propriedades: ${project?.title ?? ""}`, icon: "info" };
    }
    case "readme":
      return { title: "LEIA-ME.TXT", icon: "note" };
    case "shutdown":
      return { title: "Desligar", icon: "computer" };
  }
}
