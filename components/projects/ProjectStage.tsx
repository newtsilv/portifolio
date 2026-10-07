"use client";

import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { FREE_WINDOWS_QUERY, useMediaQuery } from "../../lib/useMediaQuery";
import type { PortfolioProject, ProjectImage } from "../../types/portfolio";
import PixelIcon from "../os/PixelIcon";
import RetroWindow from "../os/RetroWindow";
import TypeLine from "../os/TypeLine";
import {
  PropertiesTable,
  RetroButton,
  RetroLinkButton,
  StatusBar,
  Tooltip,
} from "../os/ui";
import { usePageTransition } from "../transition/PageTransition";
import { ProjectIconGraphic } from "./ProjectAppIcon";
import ProjectImageFrame from "./ProjectImageFrame";
import {
  EASE,
  HorizontalGallery,
  Parallax,
  Reveal,
  ShotWindow,
  StageProvider,
  WordReveal,
  useStage,
} from "./stage/effects";

const SECTIONS = [
  { id: "project", number: "01", label: "Projeto" },
  { id: "product", number: "02", label: "Produto" },
  { id: "features", number: "03", label: "Funcionalidades" },
  { id: "interface", number: "04", label: "Interface" },
  { id: "role", number: "05", label: "Meu papel" },
  { id: "stack", number: "06", label: "Stack" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function clickOrigin(event: MouseEvent) {
  return { x: event.clientX, y: event.clientY };
}

type ProjectStageProps = {
  project: PortfolioProject;
  position: number;
  total: number;
  prev?: PortfolioProject | undefined;
  next?: PortfolioProject | undefined;
};

/**
 * Página do projeto: um programa em tela cheia cujo conteúdo rola dentro da
 * janela, como uma matéria interativa — parallax, texto que acende com o
 * scroll, letreiro que reage à velocidade, galeria horizontal "presa" e
 * screenshots em janelinhas que dá para arrastar (e voltam pro lugar).
 */
export default function ProjectStage({
  project,
  position,
  total,
  prev,
  next,
}: ProjectStageProps) {
  const { navigate } = usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  // Arraste/hover só fora das telas de toque (no toque, o gesto é rolar).
  const finePointer = !useMediaQuery("(pointer: coarse)");
  const wide = useMediaQuery(FREE_WINDOWS_QUERY);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [active, setActive] = useState<SectionId>("project");
  const [percent, setPercent] = useState(0);

  const images = [project.cover, ...project.screenshots];
  const openImage = useCallback(
    (image: ProjectImage) => setLightbox(Math.max(images.indexOf(image), 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project.id],
  );
  const figureNumber = useCallback(
    (image: ProjectImage) => images.indexOf(image) + 1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project.id],
  );

  // Progresso de leitura (barra no topo + % na barra de status).
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressBar = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
  });
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setPercent(Math.round(value * 100)),
  );

  // Altura útil da janela, usada pelas seções de tela cheia.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () =>
      container.style.setProperty("--stage-h", `${container.clientHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function backToDesktop(event?: MouseEvent) {
    navigate("/?janela=projects", {
      ...(event ? { origin: clickOrigin(event) } : {}),
      label: "Desktop",
    });
  }

  function goToProject(target: PortfolioProject, event: MouseEvent) {
    navigate(`/projetos/${target.id}`, {
      origin: clickOrigin(event),
      label: target.title,
    });
  }

  function scrollToSection(id: SectionId) {
    const element = containerRef.current?.querySelector(`#stage-${id}`);
    if (!(element instanceof HTMLElement) || !containerRef.current) return;
    containerRef.current.scrollTo({
      top: element.offsetTop,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  // Esc fecha o visualizador ou volta ao desktop.
  const escape = useRef({ lightbox, backToDesktop });
  escape.current = { lightbox, backToDesktop };
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (escape.current.lightbox !== null) setLightbox(null);
      else escape.current.backToDesktop();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeSection = SECTIONS.find((item) => item.id === active);

  return (
    <MotionConfig reducedMotion="user">
      <StageProvider
        value={{
          containerRef,
          finePointer,
          reduceMotion,
          openImage,
          figureNumber,
        }}
      >
        <main className="wallpaper fixed inset-0 flex flex-col md:p-3 lg:p-4">
          <motion.section
            aria-labelledby="project-title"
            className="relative flex min-h-0 flex-1 flex-col border-2 border-ink bg-paper md:shadow-[6px_6px_0_var(--color-navy)]"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <TitleBar project={project} onClose={backToDesktop} />

            <nav
              aria-label="Navegação do projeto"
              className="relative flex shrink-0 items-center gap-2 border-b-2 border-ink bg-mist px-2 py-1.5"
            >
              <RetroButton onClick={backToDesktop} className="min-h-8 px-2.5">
                ← <span className="hidden sm:inline">Desktop</span>
              </RetroButton>
              <p className="hidden min-w-0 flex-1 truncate border-2 border-ink bg-paper px-2 py-1 font-mono text-xs md:block">
                <TypeLine
                  text={`C:\\Users\\newt\\Projetos\\${project.id}.app`}
                  speed={18}
                />
              </p>
              <span className="ml-auto font-mono text-xs text-navy md:ml-0">
                {pad(position)} / {pad(total)}
              </span>
              {prev ? (
                <Tooltip label={`Anterior: ${prev.title}`}>
                  <RetroButton
                    aria-label={`Projeto anterior: ${prev.title}`}
                    onClick={(event) => goToProject(prev, event)}
                    className="min-h-8 px-2.5"
                  >
                    ‹
                  </RetroButton>
                </Tooltip>
              ) : null}
              {next ? (
                <Tooltip label={`Próximo: ${next.title}`}>
                  <RetroButton
                    aria-label={`Próximo projeto: ${next.title}`}
                    onClick={(event) => goToProject(next, event)}
                    className="min-h-8 px-2.5"
                  >
                    ›
                  </RetroButton>
                </Tooltip>
              ) : null}
              {/* Progresso de leitura. */}
              <motion.span
                aria-hidden
                style={{ scaleX: progressBar }}
                className="absolute inset-x-0 -bottom-[2px] h-[3px] origin-left bg-royal"
              />
            </nav>

            <div className="relative flex min-h-0 flex-1">
              {/* O "documento" que rola dentro da janela. */}
              <div
                ref={containerRef}
                className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
              >
                <Section id="project" onActive={setActive}>
                  <Hero project={project} position={position} />
                </Section>

                <Section id="product" onActive={setActive}>
                  <Product project={project} />
                </Section>

                <Section id="features" onActive={setActive}>
                  <Features project={project} />
                </Section>

                <Section
                  id="interface"
                  onActive={setActive}
                  className="border-y-2 border-ink bg-mist"
                >
                  <HorizontalGallery
                    images={project.screenshots}
                    enabled={wide && !reduceMotion}
                    header={
                      <SectionHeading
                        number="04"
                        label="Interface"
                        aside={`${pad(project.screenshots.length)} arquivos · arraste as janelas`}
                      />
                    }
                  />
                </Section>

                <Section id="role" onActive={setActive}>
                  <Role project={project} />
                </Section>

                <Section id="stack" onActive={setActive}>
                  <Stack project={project} />
                </Section>

                <EndOfFile
                  project={project}
                  next={next}
                  onBack={backToDesktop}
                  onNext={goToProject}
                />
              </div>

              {/* Trilho lateral: onde estou e atalho para cada seção. */}
              <ol
                aria-label="Seções"
                className="hidden w-12 shrink-0 flex-col items-center justify-center gap-2 border-l-2 border-ink bg-mist lg:flex"
              >
                {SECTIONS.map((item) => {
                  const current = item.id === active;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        aria-label={`Ir para ${item.number} ${item.label}`}
                        aria-current={current ? "true" : undefined}
                        title={item.label}
                        className={`grid h-8 w-8 place-items-center border-2 font-pixel text-xs transition-colors duration-150 ${
                          current
                            ? "border-ink bg-royal text-paper"
                            : "border-steel bg-paper text-navy hover:border-ink"
                        }`}
                      >
                        {item.number}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <StatusBar
              items={[
                project.stack.map((item) => item.value).join(" • "),
                `${activeSection?.number} / ${activeSection?.label}`,
                `${percent}%`,
                "Pronto",
              ]}
            />
          </motion.section>

          {lightbox !== null && images[lightbox] ? (
            <Lightbox
              images={images}
              index={lightbox}
              onIndex={setLightbox}
              onClose={() => setLightbox(null)}
            />
          ) : null}
        </main>
      </StageProvider>
    </MotionConfig>
  );
}

function TitleBar({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: (event: MouseEvent) => void;
}) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-royal py-1 pr-1 pl-2 text-paper">
      <PixelIcon name="app" size={18} />
      <p className="min-w-0 flex-1 truncate font-pixel text-sm uppercase">
        {project.title.replace(/\s+/g, "_")}.exe
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar programa e voltar ao desktop"
        title="Fechar"
        className="retro-press grid h-8 w-8 place-items-center border-2 border-ink bg-paper text-ink shadow-[1px_1px_0_var(--color-navy)] hover:bg-sky md:h-6 md:w-6"
      >
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="h-3 w-3"
          fill="currentColor"
          shapeRendering="crispEdges"
        >
          <path d="M2 2h2v1h1v1h2V3h1V2h2v2H9v1H8v2h1v1h1v2H8V9H7V8H5v1H4v1H2V8h1V7h1V5H3V4H2z" />
        </svg>
      </button>
    </header>
  );
}

/** Seção que avisa quando cruza o meio da janela (para o trilho/status). */
function Section({
  id,
  onActive,
  className,
  children,
}: {
  id: SectionId;
  onActive: (id: SectionId) => void;
  className?: string;
  children: ReactNode;
}) {
  const { containerRef } = useStage();
  return (
    <motion.section
      id={`stage-${id}`}
      className={`relative ${className ?? ""}`}
      viewport={{ root: containerRef, margin: "-45% 0px -50% 0px" }}
      onViewportEnter={() => onActive(id)}
    >
      {children}
    </motion.section>
  );
}

/** "02 / Produto" + linha que cresce + número vazado com parallax. */
function SectionHeading({
  number,
  label,
  aside,
}: {
  number: string;
  label: string;
  aside?: string;
}) {
  const { containerRef } = useStage();
  return (
    <div className="relative">
      <Parallax
        speed={0.4}
        className="pointer-events-none absolute -top-6 right-0 select-none"
      >
        <span
          aria-hidden
          className="text-outline-steel font-pixel text-[4.5rem] leading-none md:text-[6.5rem]"
        >
          {number}
        </span>
      </Parallax>
      <motion.div
        className="relative flex items-center gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ root: containerRef, once: true, amount: 0.6 }}
      >
        <motion.h2
          className="shrink-0 font-pixel text-base text-royal uppercase md:text-lg"
          variants={{
            hidden: { opacity: 0, x: -12 },
            show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
          }}
        >
          {number} / {label}
        </motion.h2>
        <motion.span
          aria-hidden
          className="h-0.5 flex-1 origin-left bg-ink"
          variants={{
            hidden: { scaleX: 0 },
            show: {
              scaleX: 1,
              transition: { duration: 0.8, delay: 0.1, ease: EASE },
            },
          }}
        />
        {aside ? (
          <motion.span
            className="hidden shrink-0 font-mono text-xs text-navy/70 sm:inline"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { delay: 0.5 } },
            }}
          >
            {aside}
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 / Projeto                                                        */
/* ------------------------------------------------------------------ */

function Hero({
  project,
  position,
}: {
  project: PortfolioProject;
  position: number;
}) {
  const { containerRef } = useStage();
  const headline = project.headline ?? [project.title];
  const { scrollY } = useScroll({ container: containerRef });
  const hintOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const floating = [
    {
      image: project.cover,
      className: "lg:top-[8%] lg:right-[4%] lg:w-[34%]",
      rotate: 3,
      speed: 0.35,
    },
    {
      image: project.screenshots[1],
      className: "lg:top-[46%] lg:right-[27%] lg:w-[23%]",
      rotate: -4,
      speed: 0.9,
    },
    {
      image: project.screenshots[2],
      className: "lg:top-[58%] lg:right-[3%] lg:w-[20%]",
      rotate: 2,
      speed: 0.6,
    },
  ].flatMap((item) => (item.image ? [{ ...item, image: item.image }] : []));

  return (
    <div className="relative flex min-h-[var(--stage-h)] flex-col px-5 pt-8 pb-12 md:px-12 md:pt-12">
      {/* Número gigante vazado, bem atrás de tudo. */}
      <Parallax
        speed={-0.6}
        className="pointer-events-none absolute -bottom-10 left-[38%] select-none"
      >
        <span
          aria-hidden
          className="text-outline-steel font-pixel text-[8rem] leading-none md:text-[13rem]"
        >
          {pad(position)}
        </span>
      </Parallax>

      <div className="relative flex items-center gap-3 lg:w-[55%]">
        <p className="shrink-0 font-pixel text-sm text-royal uppercase">
          01 / Projeto
        </p>
        <motion.span
          aria-hidden
          className="h-0.5 flex-1 origin-left bg-ink"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        />
        <ProjectIconGraphic icon={project.icon} size={32} />
      </div>

      <motion.h1
        id="project-title"
        aria-label={project.title}
        className="relative mt-6 font-sans text-[clamp(2.25rem,4.6vw,4.75rem)] leading-[0.9] font-bold tracking-[-0.03em] uppercase lg:w-[55%]"
      >
        {headline.map((line, i) => (
          <span
            key={line}
            aria-hidden
            className="block overflow-hidden pb-[0.05em] whitespace-nowrap"
          >
            {line.split("").map((char, c) => (
              <motion.span
                key={c}
                className={`inline-block ${i % 2 === 1 ? "text-royal" : "text-ink"}`}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.55,
                  delay: 0.25 + i * 0.12 + c * 0.025,
                  ease: EASE,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>

      <motion.div
        className="relative mt-6 max-w-xl lg:w-[55%]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5, ease: EASE }}
      >
        {project.keywords?.length ? (
          <p className="font-mono text-xs tracking-[0.25em] text-navy uppercase">
            {project.keywords.join(" / ")}
          </p>
        ) : null}
        <p className="mt-3 text-base leading-snug md:text-lg">
          {project.shortDescription}
        </p>
        <p className="mt-4 font-mono text-xs text-navy/70">
          Ano · {project.year}
        </p>
      </motion.div>

      {/* Janelinhas flutuantes: espalhadas no desktop, em grade no celular. */}
      <div className="relative mt-10 grid grid-cols-2 gap-4 lg:static lg:mt-0 lg:block">
        {floating.map((item, i) => (
          <Parallax
            key={item.image.name}
            speed={item.speed}
            className={`${i === 0 ? "col-span-2" : ""} relative hover:z-30 lg:absolute ${item.className}`}
          >
            <ShotWindow
              image={item.image}
              rotate={item.rotate}
              delay={0.6 + i * 0.12}
            />
          </Parallax>
        ))}
      </div>

      <motion.p
        aria-hidden
        style={{ opacity: hintOpacity }}
        className="absolute bottom-4 left-5 hidden items-center gap-2 font-pixel text-xs text-navy uppercase md:left-12 md:flex"
      >
        role para baixo
        <span className="scroll-hint-arrow text-base leading-none">↓</span>
      </motion.p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 / Produto                                                        */
/* ------------------------------------------------------------------ */

function Product({ project }: { project: PortfolioProject }) {
  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <SectionHeading number="02" label="Produto" />
      <WordReveal
        text={project.description}
        className="mt-8 max-w-4xl text-xl leading-[1.35] font-medium md:text-2xl"
      />

      {project.modules?.length ? (
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-10">
          {project.modules.map((module, i) => {
            const shot =
              module.screenshot !== undefined
                ? project.screenshots[module.screenshot]
                : undefined;
            return (
              <div key={module.title}>
                {shot ? (
                  <ShotWindow image={shot} rotate={i % 2 === 0 ? -1.5 : 1.5} />
                ) : null}
                <Reveal className="mt-6" delay={0.1}>
                  <p className="flex items-baseline gap-3">
                    <span className="font-pixel text-3xl leading-none text-royal">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-lg font-bold uppercase md:text-xl">
                      {module.title}
                    </span>
                  </p>
                </Reveal>
                <ul className="mt-4 border-b border-steel">
                  {module.items.map((item, j) => (
                    <li key={item}>
                      <Reveal
                        y={0}
                        x={-16}
                        delay={0.15 + j * 0.06}
                        className="flex items-baseline gap-3 border-t border-steel py-2 text-base"
                      >
                        <span className="font-mono text-xs text-royal">
                          {pad(j + 1)}
                        </span>
                        {item}
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 / Funcionalidades                                                       */
/* ------------------------------------------------------------------ */

function Features({ project }: { project: PortfolioProject }) {
  return (
    <div className="grid gap-8 px-5 py-10 md:px-12 md:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] lg:gap-14">
      {/* Coluna presa enquanto a lista passa. */}
      <div className="lg:sticky lg:top-12 lg:self-start">
        <SectionHeading number="03" label="Funcionalidades" />
        <Reveal className="mt-4 max-w-xs text-sm text-navy/80" delay={0.2}>
          <p>O que a plataforma entrega. Passe o mouse para destacar.</p>
        </Reveal>
      </div>

      <ol className="border-b-2 border-ink">
        {project.features.map((feature, i) => (
          <li key={feature}>
            <Reveal
              y={30}
              delay={i * 0.06}
              className="group relative flex items-baseline gap-4 overflow-hidden border-t-2 border-ink px-2 py-4"
            >
              {/* Preenchimento azul que corre da esquerda no hover. */}
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-royal transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <span className="relative font-pixel text-2xl leading-none text-steel transition-colors duration-200 group-hover:text-sky">
                {pad(i + 1)}
              </span>
              <span className="relative text-lg font-bold uppercase transition-[color,transform] duration-200 group-hover:translate-x-2 group-hover:text-paper md:text-xl">
                {feature}
              </span>
              <span
                aria-hidden
                className="relative ml-auto font-mono text-sm text-royal transition-colors duration-200 group-hover:text-paper"
              >
                [✓]
              </span>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 05 / Meu papel                                                        */
/* ------------------------------------------------------------------ */

function Role({ project }: { project: PortfolioProject }) {
  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <SectionHeading number="05" label="Meu papel" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="font-pixel text-2xl leading-tight text-royal md:text-3xl">
              {project.role}
            </p>
          </Reveal>
          <WordReveal
            text={project.participation}
            className="mt-4 text-lg leading-snug font-medium md:text-xl"
          />
        </div>
        {project.responsibilities.length > 0 ? (
          <ul className="grid content-start gap-x-8 border-b border-steel sm:grid-cols-2">
            {project.responsibilities.map((item, i) => (
              <li key={item}>
                <Reveal
                  y={20}
                  delay={i * 0.05}
                  className="flex items-baseline justify-between gap-3 border-t border-steel py-2 text-base"
                >
                  {item}
                  <span className="font-mono text-xs text-navy/60">
                    R.{pad(i + 1)}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 / Stack                                                          */
/* ------------------------------------------------------------------ */

function Stack({ project }: { project: PortfolioProject }) {
  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <SectionHeading number="06" label="Stack" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Reveal>
          <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-2xl font-bold uppercase md:text-3xl">
            {project.stack.map((item, i) => (
              <li key={item.value} className="flex items-baseline gap-x-4">
                {item.value}
                {i < project.stack.length - 1 ? (
                  <span
                    aria-hidden
                    className="font-pixel font-normal text-royal"
                  >
                    /
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <PropertiesTable
            className="font-mono"
            rows={project.stack.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <RetroLinkButton href={project.liveUrl} variant="primary">
              Ver projeto
            </RetroLinkButton>
            <RetroLinkButton href={project.github}>GitHub</RetroLinkButton>
          </div>
          {!project.liveUrl && !project.github ? (
            <p className="mt-3 font-mono text-xs text-navy/70">
              Links em breve.
            </p>
          ) : null}
        </Reveal>
      </div>
    </div>
  );
}

/** Fim do "arquivo": volta ao desktop ou abre o próximo programa. */
function EndOfFile({
  project,
  next,
  onBack,
  onNext,
}: {
  project: PortfolioProject;
  next?: PortfolioProject | undefined;
  onBack: (event: MouseEvent) => void;
  onNext: (target: PortfolioProject, event: MouseEvent) => void;
}) {
  return (
    <footer className="border-t-2 border-ink bg-navy px-5 py-12 text-paper md:px-12 md:py-14">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] text-sky uppercase">
          EOF · {project.title.replace(/\s+/g, "_")}.exe
        </p>
        <p className="mt-2 font-pixel text-2xl md:text-3xl">Fim do arquivo.</p>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <EndLink
          label="Voltar ao desktop"
          hint="C:\Users\newt\Desktop"
          onClick={onBack}
        />
        {next ? (
          <EndLink
            label={`Próximo: ${next.title}`}
            hint={`${next.type} · ${next.year}`}
            onClick={(event) => onNext(next, event)}
            primary
          />
        ) : null}
      </div>
    </footer>
  );
}

function EndLink({
  label,
  hint,
  onClick,
  primary = false,
}: {
  label: string;
  hint: string;
  onClick: (event: MouseEvent) => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group retro-press flex items-center justify-between gap-4 border-2 border-paper px-5 py-4 text-left shadow-[4px_4px_0_var(--color-ink)] transition-colors duration-150 ${
        primary
          ? "bg-royal hover:bg-sky hover:text-ink"
          : "hover:bg-paper hover:text-ink"
      }`}
    >
      <span>
        <span className="block font-pixel text-lg uppercase">{label}</span>
        <span className="mt-1 block font-mono text-xs opacity-70">{hint}</span>
      </span>
      <span
        aria-hidden
        className="font-pixel text-3xl transition-transform duration-200 group-hover:translate-x-2"
      >
        →
      </span>
    </button>
  );
}

/** Screenshot ampliada numa janela de diálogo, com anterior/próxima. */
function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: ProjectImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const image = images[index];
  const count = images.length;
  if (!image) return null;

  const go = (step: number) => onIndex((index + step + count) % count);
  const size =
    image.width && image.height ? `${image.width} x ${image.height}` : "— x —";

  return (
    <div className="fixed inset-0 z-[500] bg-navy/60" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
      >
        <RetroWindow
          title={`Visualizador — ${image.name}`}
          icon="image"
          variant="dialog"
          width={1100}
          draggable={false}
          autoFocus
          onClose={onClose}
          bodyClassName="p-0"
          menu={
            <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-mist px-2 py-1.5">
              <RetroButton
                aria-label="Imagem anterior"
                onClick={() => go(-1)}
                className="min-h-8 px-2.5"
              >
                ←
              </RetroButton>
              <RetroButton
                aria-label="Próxima imagem"
                onClick={() => go(1)}
                className="min-h-8 px-2.5"
              >
                →
              </RetroButton>
              <span className="truncate font-mono text-xs">
                {image.caption ?? image.alt}
              </span>
            </div>
          }
          statusBar={
            <StatusBar items={[size, `${pad(index + 1)} / ${pad(count)}`]} />
          }
        >
          <ProjectImageFrame
            image={image}
            fit="contain"
            className="h-[min(calc(100dvh-12rem),62vw)] w-full border-0"
          />
        </RetroWindow>
      </div>
    </div>
  );
}
