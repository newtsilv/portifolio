"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { ProjectImage } from "../../../types/portfolio";
import PixelIcon from "../../os/PixelIcon";
import ProjectImageFrame from "../ProjectImageFrame";

/**
 * Efeitos da página de projeto. Tudo é ligado ao scroll da janela do
 * programa (não da página), por isso os efeitos leem o container do contexto.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

type StageContextValue = {
  containerRef: RefObject<HTMLDivElement | null>;
  /** Fora de telas de toque: janelas arrastáveis e efeitos de hover. */
  finePointer: boolean;
  reduceMotion: boolean;
  openImage: (image: ProjectImage) => void;
  figureNumber: (image: ProjectImage) => number;
};

const StageContext = createContext<StageContextValue | null>(null);

export const StageProvider = StageContext.Provider;

export function useStage() {
  const context = useContext(StageContext);
  if (!context) throw new Error("useStage precisa do <StageProvider>.");
  return context;
}

/** Progresso do elemento atravessando a janela (0 = entrando, 1 = saindo). */
function useElementProgress(
  ref: RefObject<HTMLElement | null>,
  offset: NonNullable<Parameters<typeof useScroll>[0]>["offset"] = [
    "start end",
    "end start",
  ],
) {
  const { containerRef } = useStage();
  return useScroll({ container: containerRef, target: ref, offset })
    .scrollYProgress;
}

/** Move o conteúdo em velocidade diferente do scroll (parallax). */
export function Parallax({
  speed,
  children,
  className,
}: {
  /** Positivo sobe mais rápido que o scroll; negativo fica para trás. */
  speed: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useStage();
  const progress = useElementProgress(ref);
  const distance = reduceMotion ? 0 : speed * 90;
  const y = useTransform(progress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Sobe com fade quando entra na janela. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
}) {
  const { containerRef } = useStage();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ root: containerRef, once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Texto que "acende" palavra por palavra conforme o scroll. */
export function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const progress = useElementProgress(ref, ["start 0.9", "end 0.55"]);
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={progress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const { reduceMotion } = useStage();
  const opacity = useTransform(
    progress,
    range,
    reduceMotion ? [1, 1] : [0.14, 1],
  );
  return (
    <motion.span
      aria-hidden
      style={{ opacity }}
      className="inline-block pr-[0.25em]"
    >
      {children}
    </motion.span>
  );
}

/** Mola macia usada para a janela voltar ao lugar e nos gestos. */
const SOFT_SPRING = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.9,
} as const;

/**
 * Screenshot como uma janelinha. No mouse dá para arrastar — e ela sempre
 * volta para o lugar com uma mola macia. Sem inércia: ao soltar, ela não
 * "voa" para outro lugar antes de voltar. Clique (sem arrastar) amplia.
 */
export function ShotWindow({
  image,
  className,
  rotate = 0,
  aspect = "aspect-[16/10]",
  delay = 0,
}: {
  image: ProjectImage;
  className?: string;
  rotate?: number;
  aspect?: string;
  delay?: number;
}) {
  const { finePointer, reduceMotion, openImage, figureNumber, containerRef } =
    useStage();
  const dragged = useRef(false);
  const canDrag = finePointer && !reduceMotion;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.figure
      className={`group relative m-0 border-2 border-ink bg-paper shadow-[5px_5px_0_var(--color-navy)] ${
        canDrag ? "cursor-grab active:cursor-grabbing" : ""
      } ${className ?? ""}`}
      style={{ rotate, x, y }}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, delay, ease: EASE },
      }}
      viewport={{ root: containerRef, once: true, amount: 0.2 }}
      // Gestos (hover, soltar o arraste) usam a mola macia, sem atraso.
      transition={SOFT_SPRING}
      drag={canDrag}
      dragMomentum={false}
      whileDrag={{ scale: 1.04, rotate: 0, zIndex: 40 }}
      {...(canDrag ? { whileHover: { y: -6, rotate: rotate * 0.4 } } : {})}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={() => {
        animate(x, 0, SOFT_SPRING);
        animate(y, 0, SOFT_SPRING);
        // O clique que encerra o arraste não deve abrir a imagem.
        window.setTimeout(() => (dragged.current = false), 50);
      }}
    >
      <figcaption className="flex items-center gap-2 border-b-2 border-ink bg-royal px-2 py-1 font-pixel text-xs text-paper uppercase select-none">
        <PixelIcon name="image" size={14} />
        <span className="min-w-0 flex-1 truncate">{image.name}</span>
        {canDrag ? (
          <span className="hidden font-mono text-[10px] normal-case opacity-0 transition-opacity duration-150 group-hover:opacity-80 sm:inline">
            arraste ✥
          </span>
        ) : null}
        <span aria-hidden className="flex gap-0.5">
          <span className="h-2.5 w-2.5 border border-ink bg-paper" />
          <span className="h-2.5 w-2.5 border border-ink bg-paper" />
        </span>
      </figcaption>
      <button
        type="button"
        onClick={() => {
          if (!dragged.current) openImage(image);
        }}
        aria-label={`Ampliar ${image.name}: ${image.alt}`}
        className="block w-full"
      >
        <ProjectImageFrame
          image={image}
          className={`pointer-events-none border-0 ${aspect}`}
        />
      </button>
      <p className="flex justify-between gap-2 border-t-2 border-ink bg-mist px-2 py-0.5 font-mono text-[10px] text-navy select-none">
        <span>FIG. {String(figureNumber(image)).padStart(2, "0")}</span>
        <span className="truncate">{image.caption ?? image.alt}</span>
      </p>
    </motion.figure>
  );
}

/**
 * Galeria que anda para o lado enquanto você rola para baixo (seção
 * "presa" na janela). No celular ou com movimento reduzido vira uma lista.
 */
export function HorizontalGallery({
  images,
  enabled,
  header,
}: {
  images: ProjectImage[];
  enabled: boolean;
  header: ReactNode;
}) {
  if (!enabled) {
    return (
      <div className="px-5 py-12">
        {header}
        <div className="mt-8 space-y-8">
          {images.map((image, i) => (
            <ShotWindow
              key={image.name}
              image={image}
              rotate={i % 2 === 0 ? -1 : 1}
              className={i % 2 === 0 ? "mr-4" : "ml-4"}
            />
          ))}
        </div>
      </div>
    );
  }

  return <HorizontalTrack images={images} header={header} />;
}

/** Versão "presa" da galeria (só monta em telas largas). */
function HorizontalTrack({
  images,
  header,
}: {
  images: ProjectImage[];
  header: ReactNode;
}) {
  const { containerRef } = useStage();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const progress = useScroll({
    container: containerRef,
    target: outerRef,
    offset: ["start start", "end end"],
  }).scrollYProgress;
  const x = useTransform(progress, [0, 1], [0, -distance]);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (track && container)
        setDistance(Math.max(track.scrollWidth - container.clientWidth, 0));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: `calc(var(--stage-h) + ${distance}px)` }}
    >
      {/* Cabeçalho no topo, janelas centralizadas no espaço que sobra. */}
      <div className="sticky top-0 flex h-[var(--stage-h)] flex-col overflow-hidden pt-8 pb-4">
        <div className="shrink-0 px-12">{header}</div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex min-h-0 w-max flex-1 items-center gap-12 px-12 py-6"
        >
          {images.map((image, i) => (
            <ShotWindow
              key={image.name}
              image={image}
              rotate={[-2, 1.5, -1, 2, -1.5][i % 5] ?? 0}
              className={`w-[min(34vw,500px,calc((var(--stage-h)-9rem)*1.45))] ${i % 2 === 0 ? "-translate-y-2" : "translate-y-2"}`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
