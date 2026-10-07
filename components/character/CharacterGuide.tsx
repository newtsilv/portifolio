"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Personagem from "./PersonagemLazy";

type CharacterGuideProps = {
  message: string;
};

/** Tempo entre uma letra e outra no efeito de digitação. */
const LETTER_DELAY = 0.018;

const bubble: Variants = {
  hidden: { scale: 0, rotate: 8, opacity: 0 },
  show: {
    scale: 1,
    rotate: -1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 520,
      damping: 18,
      // Só começa a "digitar" depois que o balão inflou.
      delayChildren: 0.12,
      staggerChildren: LETTER_DELAY,
    },
  },
  exit: {
    scale: 0.6,
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const letter: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
};

export default function CharacterGuide({ message }: CharacterGuideProps) {
  // O 3D só monta no cliente (evita trabalho no SSR e erro de hidratação).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // O balão só aparece depois que o personagem termina de carregar, pra dar
  // a impressão de que é ele quem está falando.
  const [isCharacterReady, setIsCharacterReady] = useState(false);

  return (
    <>
      {/* Balão e personagem ficam abaixo das janelas (z 10+), para nunca
          cobrirem conteúdo. No celular o balão sobe por cima do personagem. */}
      <div
        className="pointer-events-none absolute right-4 bottom-[16rem] z-[2] md:right-[300px] md:bottom-48 lg:bottom-56"
        aria-live="polite"
      >
        <span className="sr-only">{isCharacterReady ? message : ""}</span>
        <AnimatePresence mode="wait">
          {isCharacterReady ? (
            <motion.div
              key={message}
              aria-hidden
              className="relative max-w-56 origin-bottom-right border-2 border-ink bg-paper text-sm leading-snug font-medium shadow-[4px_4px_0_var(--color-navy)] md:max-w-64 md:text-base"
              variants={bubble}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.span
                variants={letter}
                className="flex items-center justify-between gap-4 border-b-2 border-ink bg-royal px-2 py-0.5 font-pixel text-xs text-paper uppercase"
              >
                newt.exe diz
              </motion.span>
              <span className="block px-3 pt-1.5 pb-2.5">
                {message.split("").map((char, i) => (
                  <motion.span key={i} variants={letter}>
                    {char}
                  </motion.span>
                ))}
              </span>
              <SpeechTail />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <aside className="pointer-events-none absolute -right-14 bottom-2 z-[1] origin-bottom-right scale-[0.6] md:right-2 md:bottom-12 md:scale-90 lg:bottom-16 lg:scale-100">
        {mounted ? (
          <Personagem onReady={() => setIsCharacterReady(true)} />
        ) : null}
      </aside>
    </>
  );
}

/** Rabinho do balão apontando para o personagem. */
function SpeechTail() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 28 22"
      className="absolute -right-[26px] bottom-3 hidden h-[22px] w-7 drop-shadow-[3px_3px_0_var(--color-navy)] md:block"
    >
      <path
        d="M0 2 L26 18 L0 16"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Cobre a borda do balão onde o rabinho encosta. */}
      <rect x="-1" y="3.6" width="4" height="11.5" fill="var(--color-paper)" />
    </svg>
  );
}
