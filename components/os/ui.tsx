import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Peças pequenas da interface do "Newt OS": botões físicos, barra de
 * status, tooltip, tabela de propriedades e caixa de grupo.
 */

type ButtonVariant = "default" | "primary";

const BUTTON_BASE =
  "retro-press inline-flex min-h-10 items-center justify-center gap-2 border-2 border-ink px-4 py-1.5 font-pixel text-sm uppercase tracking-wide shadow-[2px_2px_0_var(--color-navy)] disabled:cursor-not-allowed disabled:border-steel disabled:bg-paper disabled:text-steel disabled:shadow-none";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: "bg-paper text-ink hover:bg-mist",
  primary: "bg-royal text-paper hover:bg-navy",
};

export function buttonClass(variant: ButtonVariant = "default", extra = "") {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${extra}`;
}

export function RetroButton({
  variant = "default",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={buttonClass(variant, className)}
      {...props}
    />
  );
}

/** Link com cara de botão. Sem `href`, vira um botão desabilitado ("em breve"). */
export function RetroLinkButton({
  href,
  children,
  variant = "default",
}: {
  href?: string | undefined;
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  if (!href) {
    return (
      <button
        type="button"
        disabled
        className={buttonClass(variant)}
        title="Em breve"
      >
        {children}
      </button>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={buttonClass(variant, "group")}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-150 group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  );
}

/** Barra inferior da janela, dividida em "gomos" afundados. */
export function StatusBar({ items }: { items: ReactNode[] }) {
  return (
    <div
      role="status"
      className="flex shrink-0 items-stretch gap-1 border-t-2 border-ink bg-paper p-1 font-mono text-[11px]"
    >
      {items.map((item, i) => (
        <span
          key={i}
          className={`min-w-0 truncate border border-steel px-2 py-0.5 ${
            i === items.length - 1 && items.length > 1
              ? "ml-auto shrink-0"
              : "flex-1"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/** Tooltip só visual (para mouse). O texto acessível vai no aria-label do alvo. */
export function Tooltip({
  label,
  children,
  side = "bottom",
  className,
}: {
  label: string;
  children: ReactNode;
  side?: "bottom" | "top" | "right";
  className?: string;
}) {
  const position = {
    bottom: "top-full left-1/2 mt-1 -translate-x-1/2",
    top: "bottom-full left-1/2 mb-1 -translate-x-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  }[side];

  return (
    <span className={`group/tip relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        aria-hidden
        className={`retro-tooltip pointer-events-none absolute z-50 border border-ink bg-paper px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-ink shadow-[2px_2px_0_var(--color-navy)] ${position}`}
      >
        {label}
      </span>
    </span>
  );
}

/** Tabela "Propriedades": rótulo à esquerda, valor à direita. */
export function PropertiesTable({
  rows,
  className,
}: {
  rows: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-[minmax(6.5rem,auto)_1fr] border-t border-dashed border-steel text-sm ${className ?? ""}`}
    >
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="border-b border-dashed border-steel py-1.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-navy/70">
            {row.label}
          </dt>
          <dd className="m-0 border-b border-dashed border-steel py-1.5 font-medium">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Caixa de grupo (fieldset + legend), como nos painéis de configuração antigos. */
export function GroupBox({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      className={`min-w-0 border-2 border-steel px-4 pt-1 pb-4 ${className ?? ""}`}
    >
      <legend className="px-1.5 font-pixel text-sm uppercase text-royal">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

/** Rótulo pequeno de sistema (PROFILE, INFO...). */
export function SystemLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-pixel text-xs uppercase tracking-widest text-royal">
      {children}
    </p>
  );
}
