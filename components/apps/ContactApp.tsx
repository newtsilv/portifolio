"use client";

import { useState } from "react";
import { contacts } from "../../data/portfolio";
import type { WindowState } from "../../lib/windowState";
import ManagedWindow from "../os/ManagedWindow";
import PixelIcon from "../os/PixelIcon";
import { RetroButton, RetroLinkButton, StatusBar, SystemLabel } from "../os/ui";

/** Cartão de contato com cara de catálogo de endereços. */
export default function ContactApp({ win }: { win: WindowState }) {
  const [status, setStatus] = useState("Pronto");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contacts.email);
      setStatus("E-mail copiado para a área de transferência");
    } catch {
      setStatus("Não foi possível copiar — selecione o texto manualmente");
    }
  }

  const links = [
    { label: "GitHub", href: contacts.github },
    { label: "LinkedIn", href: contacts.linkedin },
  ];

  return (
    <ManagedWindow
      win={win}
      width={480}
      statusBar={<StatusBar items={[status]} />}
    >
      <div className="flex items-center gap-3">
        <PixelIcon name="mail" size={40} />
        <div>
          <SystemLabel>Contato</SystemLabel>
          <p className="mt-1 leading-snug">
            Quer conversar sobre um projeto ou oportunidade? Me chama.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label
          htmlFor="contact-email"
          className="font-mono text-[11px] text-navy/70 uppercase"
        >
          E-mail
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id="contact-email"
            readOnly
            value={contacts.email}
            onFocus={(event) => event.currentTarget.select()}
            className="min-h-10 min-w-0 flex-1 border-2 border-ink bg-paper px-2 font-mono text-sm shadow-[inset_2px_2px_0_var(--color-steel)]"
          />
          <RetroButton onClick={copyEmail}>Copiar</RetroButton>
        </div>
      </div>

      <ul className="mt-5 border-t border-dashed border-steel">
        {links.map((link) => (
          <li
            key={link.label}
            className="flex items-center justify-between border-b border-dashed border-steel py-2"
          >
            <span className="font-pixel uppercase">{link.label}</span>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group retro-link font-mono text-sm text-royal"
            >
              abrir{" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <RetroLinkButton href={`mailto:${contacts.email}`} variant="primary">
          Enviar e-mail
        </RetroLinkButton>
      </div>
    </ManagedWindow>
  );
}
