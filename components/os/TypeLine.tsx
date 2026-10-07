"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Linha "digitada" letra a letra, com cursor piscando no fim. Leitores de
 * tela recebem o texto inteiro de uma vez; com movimento reduzido, não anima.
 */
export default function TypeLine({
  text,
  speed = 35,
}: {
  text: string;
  speed?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const interval = window.setInterval(() => {
      setCount((value) => {
        if (value >= text.length) {
          window.clearInterval(interval);
          return value;
        }
        return value + 1;
      });
    }, speed);
    return () => window.clearInterval(interval);
  }, [text, speed, reduceMotion]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="retro-caret">
        {text.slice(0, count)}
      </span>
    </>
  );
}
