"use client";

import {
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

/**
 * Comportamento de ícone de sistema:
 * - mouse: um clique seleciona, dois cliques abrem;
 * - toque/caneta: um toque já abre (não dependemos de duplo toque);
 * - teclado: Enter abre, Espaço seleciona.
 *
 * `onOpen` recebe o ponto (na viewport) de onde a abertura partiu, para a
 * transição sair do ícone.
 */
export type OpenOrigin = { x: number; y: number };

function centerOf(element: Element): OpenOrigin {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function useIconActivation({
  onSelect,
  onOpen,
}: {
  onSelect: () => void;
  onOpen: (origin: OpenOrigin) => void;
}) {
  const pointerType = useRef<string>("mouse");

  return {
    onPointerDown(event: PointerEvent) {
      pointerType.current = event.pointerType;
    },
    onClick(event: MouseEvent) {
      // Cliques "sintéticos" de teclado chegam com detail 0: tratados no keydown.
      if (event.detail === 0) return;
      if (pointerType.current === "mouse") onSelect();
      else onOpen({ x: event.clientX, y: event.clientY });
    },
    onDoubleClick(event: MouseEvent) {
      if (pointerType.current === "mouse")
        onOpen({ x: event.clientX, y: event.clientY });
    },
    onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
        onOpen(centerOf(event.currentTarget));
      } else if (event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    },
  };
}
