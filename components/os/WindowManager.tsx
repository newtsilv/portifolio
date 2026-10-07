"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import {
  initState,
  reducer,
  type WindowSpec,
  type WindowState,
} from "../../lib/windowState";

export {
  windowKey,
  type WindowSpec,
  type WindowState,
} from "../../lib/windowState";

type WindowManagerValue = {
  windows: WindowState[];
  /** Janela em foco: a de maior z que não está minimizada. */
  activeKey: string | null;
  open: (spec: WindowSpec) => void;
  close: (key: string) => void;
  focus: (key: string) => void;
  minimize: (key: string) => void;
  toggleMaximize: (key: string) => void;
  /** Clique no botão da taskbar: restaura, foca ou minimiza. */
  toggleFromTaskbar: (key: string) => void;
  /** Área útil do desktop (limite do arraste). */
  desktopRef: RefObject<HTMLDivElement | null>;
};

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({
  initialWindows = [],
  children,
}: {
  initialWindows?: WindowSpec[];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialWindows, initState);
  const desktopRef = useRef<HTMLDivElement>(null);

  const activeKey = useMemo(() => {
    let best: WindowState | null = null;
    for (const win of state.windows) {
      if (!win.minimized && (!best || win.z > best.z)) best = win;
    }
    return best?.key ?? null;
  }, [state.windows]);

  const open = useCallback(
    (spec: WindowSpec) => dispatch({ type: "open", spec }),
    [],
  );
  const close = useCallback(
    (key: string) => dispatch({ type: "close", key }),
    [],
  );
  const focus = useCallback(
    (key: string) => dispatch({ type: "focus", key }),
    [],
  );
  const minimize = useCallback(
    (key: string) => dispatch({ type: "minimize", key }),
    [],
  );
  const toggleMaximize = useCallback(
    (key: string) => dispatch({ type: "toggleMaximize", key }),
    [],
  );

  const toggleFromTaskbar = useCallback(
    (key: string) => {
      const win = state.windows.find((item) => item.key === key);
      if (!win) return;
      if (key === activeKey) dispatch({ type: "minimize", key });
      else dispatch({ type: "focus", key });
    },
    [state.windows, activeKey],
  );

  const value = useMemo(
    () => ({
      windows: state.windows,
      activeKey,
      open,
      close,
      focus,
      minimize,
      toggleMaximize,
      toggleFromTaskbar,
      desktopRef,
    }),
    [
      state.windows,
      activeKey,
      open,
      close,
      focus,
      minimize,
      toggleMaximize,
      toggleFromTaskbar,
    ],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager precisa estar dentro de <WindowManagerProvider>.",
    );
  }
  return context;
}
