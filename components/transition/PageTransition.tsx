"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import PixelIcon from "../os/PixelIcon";

type TransitionOrigin = { x: number; y: number };

type NavigateOptions = {
  /** Ponto (em px da viewport) de onde a "tinta" se espalha. */
  origin?: TransitionOrigin;
  /** Texto grande mostrado enquanto a tela está coberta. */
  label?: string;
};

type PageTransitionContextValue = {
  navigate: (href: string, options?: NavigateOptions) => void;
};

type Phase = "idle" | "covering" | "covered" | "revealing";

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

const COVER_DURATION = 0.42;
const REVEAL_DURATION = 0.36;
/** Se a navegação travar, a cortina sai sozinha depois disso. */
const SAFETY_TIMEOUT_MS = 4000;

function pathOf(href: string) {
  return new URL(href, window.location.href).pathname;
}

/** Easing em degraus: a animação "anda" em quadros, como em PC antigo. */
function steps(count: number) {
  return (t: number) => Math.min(1, Math.ceil(t * count) / count);
}

/**
 * Transição entre telas, no estilo "zoom de janela" dos sistemas antigos:
 * uma janela cresce em degraus a partir do clique até cobrir a tela, mostra
 * "Abrindo…" com barra de progresso, a rota troca por baixo e a janela se
 * fecha em degraus. Fica no layout raiz, então sobrevive à troca de rota.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState<TransitionOrigin>({ x: 0, y: 0 });
  const [label, setLabel] = useState("");
  const targetRef = useRef<{ href: string; path: string } | null>(null);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      if (phase !== "idle") return;

      if (reduceMotion) {
        router.push(href, { scroll: false });
        return;
      }

      router.prefetch(href);
      targetRef.current = { href, path: pathOf(href) };
      setOrigin(
        options.origin ?? {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        },
      );
      setLabel(options.label ?? "");
      setPhase("covering");
    },
    [phase, reduceMotion, router],
  );

  function handleCovered() {
    const target = targetRef.current;
    if (!target) return;

    setPhase("covered");
    if (target.path === pathname) {
      setPhase("revealing");
      return;
    }
    router.push(target.href, { scroll: false });
  }

  // A nova rota foi montada: hora de levantar a cortina.
  useEffect(() => {
    if (phase === "covered" && targetRef.current?.path === pathname) {
      setPhase("revealing");
    }
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "covered") return;
    const timeout = window.setTimeout(
      () => setPhase("revealing"),
      SAFETY_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [phase]);

  // Retângulo inicial (um "ícone" em volta do clique) em coordenadas de inset.
  const vw = typeof window === "undefined" ? 0 : window.innerWidth;
  const vh = typeof window === "undefined" ? 0 : window.innerHeight;
  const from = `inset(${Math.max(origin.y - 24, 0)}px ${Math.max(vw - origin.x - 24, 0)}px ${Math.max(vh - origin.y - 24, 0)}px ${Math.max(origin.x - 24, 0)}px)`;
  const full = "inset(0px 0px 0px 0px)";
  // Fecha como TV antiga: vira uma linha no meio e some.
  const closed = "inset(50% 0px 50% 0px)";

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}

      {phase !== "idle" ? (
        <motion.div
          key="page-transition"
          aria-hidden
          className="page-transition fixed inset-0 z-9000 flex flex-col border-2 border-ink bg-navy text-paper"
          initial={{ clipPath: from }}
          animate={
            phase === "revealing"
              ? {
                  clipPath: closed,
                  transition: { duration: REVEAL_DURATION, ease: steps(5) },
                }
              : {
                  clipPath: full,
                  transition: { duration: COVER_DURATION, ease: steps(7) },
                }
          }
          onAnimationComplete={() => {
            if (phase === "covering") handleCovered();
            else if (phase === "revealing") {
              targetRef.current = null;
              setPhase("idle");
            }
          }}
        >
          {/* A cortina é ela mesma uma janela abrindo em tela cheia. */}
          <p className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-royal px-3 py-1.5 font-pixel text-sm uppercase">
            <PixelIcon name="app" size={16} />
            {label ? `${label.replace(/\s+/g, "_")}.exe` : "Newt OS"}
          </p>
          <div className="grid flex-1 place-items-center">
            <div className="w-[min(22rem,calc(100vw-2rem))] border-2 border-ink bg-paper text-ink shadow-[5px_5px_0_var(--color-ink)]">
              <p className="flex items-center gap-2 border-b-2 border-ink bg-mist px-2 py-1 font-pixel text-xs text-navy uppercase">
                <PixelIcon name="computer" size={14} />
                Newt OS
              </p>
              <div className="p-4">
                <p className="font-pixel text-sm uppercase">
                  {phase === "revealing" ? "Pronto" : "Abrindo"}
                  <span className="page-transition-dots" />
                </p>
                <div className="mt-2 h-5 border-2 border-ink p-0.5">
                  <div className="retro-progress h-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition precisa estar dentro de <PageTransitionProvider>.",
    );
  }
  return context;
}
