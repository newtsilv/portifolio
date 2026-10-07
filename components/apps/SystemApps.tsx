"use client";

import { useState } from "react";
import { owner } from "../../data/portfolio";
import type { WindowState } from "../../lib/windowState";
import ManagedWindow from "../os/ManagedWindow";
import PixelIcon from "../os/PixelIcon";
import { RetroButton, StatusBar } from "../os/ui";
import { useWindowManager } from "../os/WindowManager";

/** CURRICULO.TXT: visualizador de texto simples. */
export function ResumeApp({ win }: { win: WindowState }) {
  return (
    <ManagedWindow
      win={win}
      width={560}
      bodyClassName="bg-paper p-0"
      statusBar={<StatusBar items={["Ln 1, Col 1", "UTF-8"]} />}
    >
      <div className="space-y-4 p-4 font-mono text-sm leading-relaxed md:p-5">
        <p>
          {owner.name.toUpperCase()}
          <br />
          {owner.role} · {owner.location}
        </p>
        <p className="text-navy/70">----------------------------------------</p>
        <p>
          Resumo profissional temporário. Depois podemos adicionar experiências,
          formação e um arquivo para download.
        </p>
        <RetroButton disabled>
          <PixelIcon name="document" size={16} />
          Baixar PDF (em breve)
        </RetroButton>
      </div>
    </ManagedWindow>
  );
}

/** LEIA-ME.TXT: bilhete curto explicando como navegar. */
export function ReadmeNote({ win }: { win: WindowState }) {
  return (
    <ManagedWindow
      win={win}
      width={380}
      variant="tool"
      offset={{ x: 380, y: 40 }}
      canMaximize={false}
    >
      <div className="space-y-3 font-mono text-sm leading-relaxed">
        <p>Olá! Este é o meu computador.</p>
        <ul className="space-y-1">
          <li>▪ Duplo clique (ou Enter) abre um ícone.</li>
          <li>▪ No celular, um toque já abre.</li>
          <li>▪ Arraste as janelas pela barra azul.</li>
          <li>▪ Esc fecha a janela em foco.</li>
          <li>▪ Os projetos estão na pasta Projetos.</li>
        </ul>
        <p className="text-navy/70">— {owner.shortName}</p>
      </div>
    </ManagedWindow>
  );
}

/** Easter egg do menu Iniciar: "desligar" só agradece a visita. */
export function ShutdownDialog({ win }: { win: WindowState }) {
  const { close } = useWindowManager();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <ManagedWindow
      win={win}
      width={360}
      variant="dialog"
      canMinimize={false}
      canMaximize={false}
    >
      <div className="flex gap-3" aria-live="polite">
        <PixelIcon name={confirmed ? "computer" : "info"} size={36} />
        <p className="pt-1 leading-snug">
          {confirmed ? (
            <>
              <span className="font-pixel text-lg text-royal">
                Obrigado pela visita :)
              </span>
              <br />
              Brincadeira, nada foi desligado.
            </>
          ) : (
            "Tem certeza de que deseja desligar o computador?"
          )}
        </p>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {confirmed ? (
          <RetroButton variant="primary" onClick={() => close(win.key)}>
            Religar
          </RetroButton>
        ) : (
          <>
            <RetroButton variant="primary" onClick={() => setConfirmed(true)}>
              Sim
            </RetroButton>
            <RetroButton onClick={() => close(win.key)}>Cancelar</RetroButton>
          </>
        )}
      </div>
    </ManagedWindow>
  );
}
