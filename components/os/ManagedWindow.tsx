"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { WindowState } from "../../lib/windowState";
import RetroWindow, { type RetroWindowVariant } from "./RetroWindow";
import { windowMeta } from "./windowMeta";
import { useWindowManager } from "./WindowManager";

/**
 * RetroWindow ligada ao gerenciador de janelas: título/ícone vêm do tipo da
 * janela, e foco, minimizar, maximizar e fechar vão para o estado global.
 */
export default function ManagedWindow({
  win,
  children,
  width,
  height,
  variant = "default",
  menu,
  statusBar,
  bodyClassName,
  offset = { x: 0, y: 0 },
  canMinimize = true,
  canMaximize = true,
  onKeyDown,
}: {
  win: WindowState;
  children: ReactNode;
  width?: number;
  height?: number;
  variant?: RetroWindowVariant;
  menu?: ReactNode;
  statusBar?: ReactNode;
  bodyClassName?: string;
  /** Deslocamento extra da posição em cascata (janelas secundárias). */
  offset?: { x: number; y: number };
  canMinimize?: boolean;
  canMaximize?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
}) {
  const manager = useWindowManager();
  const meta = windowMeta(win.spec);
  const step = (win.seq - 1) % 6;

  return (
    <RetroWindow
      title={meta.title}
      icon={meta.icon}
      variant={variant}
      width={width ?? 640}
      {...(height ? { height } : {})}
      position={{ x: 150 + step * 36 + offset.x, y: 20 + step * 30 + offset.y }}
      focused={manager.activeKey === win.key}
      zIndex={win.z}
      minimized={win.minimized}
      maximized={win.maximized}
      onFocus={() => manager.focus(win.key)}
      onClose={() => manager.close(win.key)}
      {...(canMinimize ? { onMinimize: () => manager.minimize(win.key) } : {})}
      {...(canMaximize
        ? { onMaximize: () => manager.toggleMaximize(win.key) }
        : {})}
      dragConstraints={manager.desktopRef}
      autoFocus
      {...(menu ? { menu } : {})}
      {...(statusBar ? { statusBar } : {})}
      {...(bodyClassName !== undefined ? { bodyClassName } : {})}
      {...(onKeyDown ? { onKeyDown } : {})}
    >
      {children}
    </RetroWindow>
  );
}
