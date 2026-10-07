"use client";

import { owner } from "../../data/portfolio";
import type { WindowState } from "../../lib/windowState";
import ZeroPortrait from "../effects/ZeroPortrait";
import ManagedWindow from "../os/ManagedWindow";
import { GroupBox, PropertiesTable, StatusBar, SystemLabel } from "../os/ui";
import TypeLine from "../os/TypeLine";

/** ABOUT_ME: um pequeno programa de perfil, em vez de "foto + texto". */
export default function AboutApp({ win }: { win: WindowState }) {
  return (
    <ManagedWindow
      win={win}
      width={720}
      statusBar={
        <StatusBar
          items={[`user: ${owner.shortName.toLowerCase()}`, owner.status]}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
        {/* Retrato desenhado com zeros (passe o mouse para espalhar). */}
        <figure className="m-0 self-start border-2 border-ink bg-paper">
          <ZeroPortrait
            src="/assets/about/sobre-mim-zeros.png"
            alt="Ilustração de Newton sorrindo e segurando uma carta de baralho, desenhada com o caractere zero"
            maxSize={196}
          />
          <figcaption className="border-t-2 border-ink bg-mist px-2 py-1 font-mono text-[11px]">
            profile.png
          </figcaption>
        </figure>

        <div className="min-w-0 space-y-4">
          <div>
            <SystemLabel>Perfil</SystemLabel>
            <p className="mt-2 font-mono text-sm text-royal">
              <span aria-hidden>&gt; </span>
              <TypeLine text={`whoami — ${owner.role.toLowerCase()}`} />
            </p>
            <h3 className="mt-1 font-pixel text-2xl leading-tight text-navy md:text-3xl">
              {owner.name}
            </h3>
          </div>

          <div className="space-y-2 leading-relaxed">
            {owner.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div>
            <SystemLabel>Informações</SystemLabel>
            <PropertiesTable
              className="mt-2"
              rows={[
                { label: "Nome", value: owner.name },
                { label: "Cargo", value: owner.role },
                { label: "Local", value: owner.location },
                { label: "Status", value: owner.status },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <GroupBox label="Formação">
          <ul className="space-y-2 text-sm">
            {owner.education.map((item) => (
              <li key={item.title}>
                <p className="font-semibold">{item.title}</p>
                <p className="font-mono text-xs text-navy/70">{item.detail}</p>
              </li>
            ))}
          </ul>
        </GroupBox>
        <GroupBox label="Interesses">
          <ul className="space-y-1 text-sm">
            {owner.interests.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-royal">
                  ▪
                </span>
                {item}
              </li>
            ))}
          </ul>
        </GroupBox>
        <GroupBox label="Idiomas">
          <ul className="space-y-1 text-sm">
            {owner.languages.map((item) => (
              <li key={item.name} className="flex justify-between gap-2">
                {item.name}
                <span className="font-mono text-xs text-navy/70">
                  {item.level}
                </span>
              </li>
            ))}
          </ul>
        </GroupBox>
      </div>
    </ManagedWindow>
  );
}
