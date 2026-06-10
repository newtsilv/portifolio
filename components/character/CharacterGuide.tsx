"use client";

import Personagem from "./Personagem";

type CharacterGuideProps = {
  message: string;
};

export default function CharacterGuide({ message }: CharacterGuideProps) {
  return (
    <aside className="pointer-events-none fixed bottom-16 right-6 z-[80] flex items-end gap-3">
      <div className="mb-28 max-w-64 rotate-[-1deg] rounded-md border-4 border-neutral-950 bg-white px-4 py-3 text-base font-black shadow-[6px_6px_0_#111]">
        {message}
      </div>
      <Personagem className="scale-75" />
    </aside>
  );
}
