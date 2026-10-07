"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "../transition/PageTransition";
import PixelIcon from "./PixelIcon";
import RetroWindow from "./RetroWindow";
import { RetroButton } from "./ui";

/** 404 como mensagem de erro do sistema. */
export default function NotFoundDialog() {
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  function goBack() {
    if (window.history.length > 1) window.history.back();
    else navigate("/", { label: "Desktop" });
  }

  return (
    <main className="wallpaper fixed inset-0">
      <h1 className="sr-only">Erro 404: arquivo não encontrado</h1>
      <RetroWindow
        title="Erro 404"
        icon="error"
        variant="dialog"
        width={440}
        draggable={false}
        autoFocus
        onClose={() => navigate("/", { label: "Desktop" })}
      >
        <div className="flex gap-4">
          <PixelIcon name="error" size={44} />
          <div className="min-w-0 space-y-2">
            <p className="font-pixel text-xl text-royal uppercase">Erro 404</p>
            <p className="leading-snug">
              O arquivo que você procurava não foi encontrado.
            </p>
            <p className="truncate font-mono text-xs text-navy/70">
              C:\{pathname?.replaceAll("/", "\\").replace(/^\\/, "")}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <RetroButton variant="primary" onClick={goBack}>
            Voltar
          </RetroButton>
          <RetroButton onClick={() => navigate("/", { label: "Desktop" })}>
            Desktop
          </RetroButton>
        </div>
      </RetroWindow>
    </main>
  );
}
