import type { PortfolioSectionId } from "../types/portfolio";

/*
 * Estado puro das janelas do desktop (sem React), para poder ser testado.
 */

/** O que uma janela mostra. A chave deriva disso (uma janela por chave). */
export type WindowSpec =
  | { kind: "section"; id: PortfolioSectionId }
  | { kind: "properties"; projectId: string }
  | { kind: "readme" }
  | { kind: "shutdown" };

export type WindowState = {
  key: string;
  spec: WindowSpec;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Ordem de abertura: define a cascata e a ordem na taskbar. */
  seq: number;
};

export function windowKey(spec: WindowSpec) {
  switch (spec.kind) {
    case "section":
      return `section:${spec.id}`;
    case "properties":
      return `${spec.kind}:${spec.projectId}`;
    default:
      return spec.kind;
  }
}

export type State = { windows: WindowState[]; topZ: number; seq: number };

export type Action =
  | { type: "open"; spec: WindowSpec }
  | { type: "close"; key: string }
  | { type: "focus"; key: string }
  | { type: "minimize"; key: string }
  | { type: "toggleMaximize"; key: string };

const BASE_Z = 10;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open": {
      const key = windowKey(action.spec);
      const topZ = state.topZ + 1;
      const existing = state.windows.find((win) => win.key === key);
      if (existing) {
        // Já aberta: atualiza o conteúdo (ex.: outra imagem no viewer) e traz pra frente.
        return {
          ...state,
          topZ,
          windows: state.windows.map((win) =>
            win.key === key
              ? { ...win, spec: action.spec, z: topZ, minimized: false }
              : win,
          ),
        };
      }
      const seq = state.seq + 1;
      return {
        topZ,
        seq,
        windows: [
          ...state.windows,
          {
            key,
            spec: action.spec,
            z: topZ,
            minimized: false,
            maximized: false,
            seq,
          },
        ],
      };
    }
    case "close":
      return {
        ...state,
        windows: state.windows.filter((win) => win.key !== action.key),
      };
    case "focus": {
      const target = state.windows.find((win) => win.key === action.key);
      if (!target || (target.z === state.topZ && !target.minimized))
        return state;
      const topZ = state.topZ + 1;
      return {
        ...state,
        topZ,
        windows: state.windows.map((win) =>
          win.key === action.key ? { ...win, z: topZ, minimized: false } : win,
        ),
      };
    }
    case "minimize":
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.key === action.key ? { ...win, minimized: true } : win,
        ),
      };
    case "toggleMaximize":
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.key === action.key ? { ...win, maximized: !win.maximized } : win,
        ),
      };
  }
}

export function initState(initial: WindowSpec[]): State {
  return initial.reduce<State>(
    (state, spec) => reducer(state, { type: "open", spec }),
    { windows: [], topZ: BASE_Z, seq: 0 },
  );
}
