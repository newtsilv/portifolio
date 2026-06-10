import { portfolioSections } from "../../data/portfolio";
import Personagem from "../character/Personagem";
import MobileSectionCard from "./MobileSectionCard";

export default function MobilePortfolio() {
  return (
    <section className="sketch-bg min-h-screen px-5 py-8">
      <div className="rounded-lg border-4 border-neutral-950 bg-white/80 p-5 shadow-[7px_7px_0_#111]">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700">
          Portfolio OS
        </p>
        <h1 className="mt-3 text-4xl font-black leading-none">
          Meu portfolio em estilo cartoon
        </h1>
        <p className="mt-4 text-base font-semibold text-neutral-700">
          No computador ele vira uma area de trabalho interativa. No celular,
          organizei tudo como uma landing page temática.
        </p>
        <div className="mt-8 flex justify-center">
          <Personagem className="scale-[0.65]" />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {portfolioSections.map((section) => (
          <MobileSectionCard key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
