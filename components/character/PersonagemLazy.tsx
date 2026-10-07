"use client";

import dynamic from "next/dynamic";
import ZeroLoader from "../effects/ZeroLoader";

/**
 * Carrega o personagem (e o bundle do three.js, ~150 kB) só no cliente e
 * fora do chunk inicial da página, para o resto da interface pintar antes.
 */
const PersonagemLazy = dynamic(() => import("./Personagem"), {
  ssr: false,
  loading: () => (
    <div
      className="personagem-float flex h-75 w-75 items-center justify-center"
      aria-hidden
    >
      <ZeroLoader />
    </div>
  ),
});

export default PersonagemLazy;
