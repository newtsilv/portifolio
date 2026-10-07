"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type MenuItem =
  | {
      label: string;
      onSelect: () => void;
      disabled?: boolean;
      /** Marca de "opção ativa" (ex.: modo de visualização). */
      checked?: boolean;
      hint?: string;
    }
  | "separator";

/**
 * Lista de opções de um menu (barra de menus ou menu de contexto).
 * Setas navegam, Enter seleciona, Esc fecha.
 */
export function PopupMenu({
  items,
  onClose,
  label,
  className,
  style,
}: {
  items: MenuItem[];
  onClose: () => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    ref.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();

    function handlePointer(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) onCloseRef.current();
    }
    // No próximo tick, para o clique que abriu o menu não fechá-lo.
    const timeout = window.setTimeout(() =>
      document.addEventListener("pointerdown", handlePointer),
    );
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent) {
    const buttons = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ) ?? [],
    );
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      buttons[(index + 1) % buttons.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
    } else if (event.key === "Tab") {
      onClose();
    }
  }

  return (
    <ul
      ref={ref}
      role="menu"
      aria-label={label}
      onKeyDown={handleKeyDown}
      style={style}
      className={`z-[1100] min-w-44 border-2 border-ink bg-paper py-1 shadow-[3px_3px_0_var(--color-navy)] ${className ?? ""}`}
    >
      {items.map((item, i) =>
        item === "separator" ? (
          <li
            key={i}
            role="separator"
            className="mx-2 my-1 border-t border-steel"
          />
        ) : (
          <li key={item.label} role="none">
            <button
              type="button"
              role={item.checked === undefined ? "menuitem" : "menuitemradio"}
              aria-checked={item.checked}
              disabled={item.disabled}
              onClick={() => {
                onClose();
                item.onSelect();
              }}
              className="flex min-h-9 w-full items-center gap-2 px-3 text-left font-pixel text-sm text-ink hover:bg-royal hover:text-paper focus-visible:bg-royal focus-visible:text-paper focus-visible:outline-none disabled:text-steel disabled:hover:bg-transparent"
            >
              <span aria-hidden className="w-3">
                {item.checked ? "•" : ""}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.hint ? (
                <span className="font-mono text-[10px] opacity-60">
                  {item.hint}
                </span>
              ) : null}
            </button>
          </li>
        ),
      )}
    </ul>
  );
}

/** Barra de menus (File / Edit / View) de uma janela. */
export function MenuBar({
  menus,
}: {
  menus: { label: string; items: MenuItem[] }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex shrink-0 items-center gap-0.5 border-b-2 border-ink bg-paper px-1 py-0.5">
      {menus.map((menu) => (
        <div key={menu.label} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open === menu.label}
            onClick={() =>
              setOpen((current) => (current === menu.label ? null : menu.label))
            }
            className={`min-h-8 px-2.5 font-pixel text-sm ${
              open === menu.label ? "bg-royal text-paper" : "hover:bg-mist"
            }`}
          >
            {menu.label}
          </button>
          {open === menu.label ? (
            <PopupMenu
              label={menu.label}
              items={menu.items}
              onClose={() => setOpen(null)}
              className="absolute top-full left-0 mt-0.5"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Menu de contexto no ponto do clique. Vai por portal para o <body>: dentro
 * de uma janela (que tem transform), `position: fixed` sairia deslocado.
 */
export function ContextMenu({
  x,
  y,
  items,
  label,
  onClose,
}: {
  x: number;
  y: number;
  items: MenuItem[];
  label: string;
  onClose: () => void;
}) {
  const left =
    typeof window === "undefined" ? x : Math.min(x, window.innerWidth - 200);
  const top =
    typeof window === "undefined" ? y : Math.min(y, window.innerHeight - 160);

  return createPortal(
    <PopupMenu
      label={label}
      items={items}
      onClose={onClose}
      className="fixed"
      style={{ left, top }}
    />,
    document.body,
  );
}
