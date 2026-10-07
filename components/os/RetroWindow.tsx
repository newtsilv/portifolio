"use client";

import {
  motion,
  useDragControls,
  useMotionValue,
  type MotionStyle,
} from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { FREE_WINDOWS_QUERY, useMediaQuery } from "../../lib/useMediaQuery";
import type { PixelIconName } from "../../types/portfolio";
import PixelIcon from "./PixelIcon";

export type RetroWindowVariant = "default" | "tool" | "dialog";

export type RetroWindowProps = {
  title: string;
  icon: PixelIconName;
  children: ReactNode;
  /** Linha logo abaixo da barra de título (menus, abas...). */
  menu?: ReactNode;
  /** Rodapé (normalmente uma <StatusBar />). */
  statusBar?: ReactNode;
  /** Largura em px a partir do tablet. */
  width?: number;
  /** Altura fixa em px no desktop (senão cresce com o conteúdo). */
  height?: number;
  /** Posição inicial no desktop (>= 1024px). */
  position?: { x: number; y: number };
  variant?: RetroWindowVariant;
  focused?: boolean;
  zIndex?: number;
  minimized?: boolean;
  maximized?: boolean;
  onFocus?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  /** Só tem efeito em telas >= 1024px. */
  draggable?: boolean;
  dragConstraints?: RefObject<HTMLElement | null>;
  /** Move o foco do teclado para a janela quando ela abre. */
  autoFocus?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  bodyClassName?: string;
};

/**
 * Janela do "Newt OS".
 *
 * O layout responsivo fica todo no CSS (sem pulo na hidratação):
 * - celular: ocupa a tela acima da taskbar, sem arraste;
 * - tablet: centralizada, sem arraste;
 * - desktop: posicionada, arrastável pela barra de título.
 */
export default function RetroWindow({
  title,
  icon,
  children,
  menu,
  statusBar,
  width = 640,
  height,
  position = { x: 160, y: 32 },
  variant = "default",
  focused = true,
  zIndex,
  minimized = false,
  maximized = false,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  draggable = true,
  dragConstraints,
  autoFocus = false,
  onKeyDown,
  bodyClassName,
}: RetroWindowProps) {
  const titleId = useId();
  const ref = useRef<HTMLElement>(null);
  const isFree = useMediaQuery(FREE_WINDOWS_QUERY);
  const canDrag = draggable && isFree && !maximized;

  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const savedOffset = useRef({ x: 0, y: 0 });

  // Maximizada ou em tela menor: zera o deslocamento do arraste (e guarda
  // para devolver a janela ao lugar quando restaurar).
  useEffect(() => {
    if (!isFree || maximized) {
      if (maximized) savedOffset.current = { x: x.get(), y: y.get() };
      x.set(0);
      y.set(0);
    } else {
      x.set(savedOffset.current.x);
      y.set(savedOffset.current.y);
    }
  }, [isFree, maximized, x, y]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  function handleTitlePointerDown(event: PointerEvent) {
    onFocus?.();
    if (canDrag) dragControls.start(event);
  }

  // Variáveis CSS lidas pelas classes de layout (ver layoutClass).
  const style = {
    x,
    y,
    ...(zIndex !== undefined ? { zIndex } : {}),
    "--w": `${width}px`,
    "--x": `${position.x}px`,
    "--y": `${position.y}px`,
    ...(height ? { "--h": `${height}px` } : {}),
  } as MotionStyle;

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-modal={false}
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`fixed flex flex-col overflow-hidden border-2 border-ink bg-paper focus-visible:outline-none ${layoutClass(
        variant,
        maximized,
        Boolean(height),
      )} ${
        focused
          ? "shadow-[5px_5px_0_var(--color-navy)]"
          : "shadow-[3px_3px_0_var(--color-steel)]"
      } ${minimized ? "hidden" : ""}`}
      style={style}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      drag={canDrag}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      {...(dragConstraints ? { dragConstraints } : {})}
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
      onKeyDown={onKeyDown}
    >
      <header
        className={`flex shrink-0 touch-none items-center gap-2 border-b-2 border-ink py-1 pr-1 pl-2 select-none ${
          focused ? "bg-royal text-paper" : "bg-steel text-navy"
        } ${canDrag ? "cursor-move" : ""}`}
        onPointerDown={handleTitlePointerDown}
        onDoubleClick={onMaximize}
      >
        <PixelIcon name={icon} size={18} />
        <h2
          id={titleId}
          className="min-w-0 flex-1 truncate font-pixel text-sm leading-none uppercase tracking-wide"
        >
          {title}
        </h2>
        <div
          className="flex gap-1"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {onMinimize ? (
            <TitleButton
              label={`Minimizar ${title}`}
              onClick={onMinimize}
              glyph="minimize"
            />
          ) : null}
          {onMaximize ? (
            <TitleButton
              label={maximized ? `Restaurar ${title}` : `Maximizar ${title}`}
              onClick={onMaximize}
              glyph={maximized ? "restore" : "maximize"}
              className="hidden md:grid"
            />
          ) : null}
          {onClose ? (
            <TitleButton
              label={`Fechar ${title}`}
              onClick={onClose}
              glyph="close"
            />
          ) : null}
        </div>
      </header>

      {menu}

      <div
        className={`min-h-0 flex-1 overflow-auto ${bodyClassName ?? "p-4 md:p-5"}`}
      >
        {children}
      </div>

      {statusBar}
    </motion.section>
  );
}

/** Classes de posição/tamanho por variante e estado (ver comentário acima). */
function layoutClass(
  variant: RetroWindowVariant,
  maximized: boolean,
  fixedHeight: boolean,
) {
  if (variant === "dialog") {
    return "top-1/2 left-1/2 w-[min(var(--w),calc(100vw-2rem))] max-h-[calc(100dvh-var(--taskbar-h)-2rem)] -translate-x-1/2 -translate-y-1/2";
  }

  const mobile = "inset-x-0 top-0 bottom-[var(--taskbar-h)]";

  if (maximized) {
    return `${mobile} md:left-0 md:right-0 md:top-0 md:bottom-[var(--taskbar-h)]`;
  }

  const tablet =
    "md:inset-auto md:top-[5vh] md:left-1/2 md:w-[min(var(--w),calc(100vw-3rem))] md:-translate-x-1/2 md:max-h-[calc(100dvh-var(--taskbar-h)-8vh)]";
  const desktop = `lg:top-[var(--y)] lg:left-[var(--x)] lg:w-[min(var(--w),calc(100vw-var(--x)-1.5rem))] lg:translate-x-0 lg:max-h-[calc(100dvh-var(--taskbar-h)-var(--y)-1rem)] ${
    fixedHeight ? "lg:h-[var(--h)]" : ""
  }`;

  return `${mobile} ${tablet} ${desktop}`;
}

type Glyph = "minimize" | "maximize" | "restore" | "close";

const GLYPHS: Record<Glyph, ReactNode> = {
  minimize: <rect x="3" y="9" width="6" height="2" />,
  maximize: <path d="M2 2h8v8H2z M3 4v5h6V4z" fillRule="evenodd" />,
  restore: (
    <path
      d="M4 1h7v7H9v3H1V4h3z M5 3v1h4v3h1V3z M2 6v4h6V6z"
      fillRule="evenodd"
    />
  ),
  close: (
    <path d="M2 2h2v1h1v1h2V3h1V2h2v2H9v1H8v2h1v1h1v2H8V9H7V8H5v1H4v1H2V8h1V7h1V5H3V4H2z" />
  ),
};

function TitleButton({
  label,
  onClick,
  glyph,
  className,
}: {
  label: string;
  onClick: () => void;
  glyph: Glyph;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onDoubleClick={(event) => event.stopPropagation()}
      className={`retro-press grid h-8 w-8 place-items-center border-2 border-ink bg-paper text-ink shadow-[1px_1px_0_var(--color-navy)] hover:bg-mist md:h-6 md:w-6 ${
        glyph === "close" ? "hover:bg-sky" : ""
      } ${className ?? ""}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="h-3 w-3"
        fill="currentColor"
        shapeRendering="crispEdges"
      >
        {GLYPHS[glyph]}
      </svg>
    </button>
  );
}
