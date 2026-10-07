"use client";

import { useEffect, useState } from "react";

/** Breakpoint a partir do qual as janelas ficam livres (arrastáveis). */
export const FREE_WINDOWS_QUERY = "(min-width: 1024px)";

/**
 * Estado de uma media query no cliente. Retorna `false` no SSR e no
 * primeiro render, então só use para comportamento (drag, etc.) — o layout
 * em si deve ficar no CSS para não "pular" na hidratação.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
