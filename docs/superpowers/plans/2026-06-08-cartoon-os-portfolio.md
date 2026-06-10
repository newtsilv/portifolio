# Cartoon OS Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive cartoon OS portfolio where desktop users interact with draggable windows and mobile users get a themed landing page.

**Architecture:** Use Next.js App Router with `app/layout.tsx` and `app/page.tsx`, keeping reusable UI in focused component folders and portfolio content in `data/portfolio.ts`. Use Framer Motion for dragging via `motion.div`, `useDragControls`, and title-bar pointer handling, following the documented drag-control pattern. Use Tailwind CSS classes for the cartoon OS styling and responsive split.

**Tech Stack:** Next.js 13 Pages Router, React 18, TypeScript, Tailwind CSS 4, Framer Motion 12, Jest.

---

## File Structure

- Create: `app/layout.tsx` — root layout, metadata, and global CSS import.
- Create: `app/page.tsx` — App Router home page that renders desktop and mobile experiences.
- Create: `data/portfolio.ts` — shared portfolio data.
- Create: `types/portfolio.ts` — shared portfolio types.
- Create: `components/desktop/*` — reusable desktop OS components.
- Create: `components/mobile/*` — reusable mobile landing components.
- Create: `components/portfolio/PortfolioSectionContent.tsx` — shared section rendering.
- Remove: `pages/index.tsx` and `pages/_app.tsx` — Pages Router home route and app wrapper are replaced by App Router.
- Move/modify: `components/Personagem.tsx` — keep the current character, adjust sizing/positioning props only if needed for reuse in desktop and mobile contexts.
- Move/modify: `components/Eye.tsx` — fix the zero-distance mouse calculation so the pupil transform never becomes `NaN`.
- Modify: `styles/globals.css` — replace black-only background with global sizing and default font/background support.
- Create: `pages/index.test.tsx` if the current Jest setup supports React component tests; otherwise create pure helper tests only after inspecting current Jest setup during execution.

## Documentation Notes

- Next.js 13.5.11 docs show `next/image` can use public assets with `src="/profile.png"`, explicit `width`, `height`, and `alt` props.
- Framer Motion docs show controlled dragging with `useDragControls`, `dragControls`, `dragListener={false}`, and `onPointerDown={(event) => dragControls.start(event)}` on a separate drag handle. Use that for title-bar-only window dragging.

---

### Task 1: Stabilize Existing Character Components

**Files:**

- Move/modify: `components/Eye.tsx`
- Move/modify: `components/Personagem.tsx`

- [ ] **Step 1: Write the expected `Eye` guard change**

Update `components/Eye.tsx` so `handleMouseMove` returns before division when the mouse is exactly at the eye center:

```tsx
const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

if (distance === 0) return;

const maxMove = width / 2 - (width * 0.3) / 2 - 5;
```

- [ ] **Step 2: Keep character reusable**

Update `components/Personagem.tsx` to accept an optional `className` and keep the current animation/image behavior:

```tsx
import Eye from "./Eye";
import Image from "next/image";
import { motion } from "framer-motion";

type PersonagemProps = {
  className?: string;
};

export default function Personagem({ className = "" }: PersonagemProps) {
  return (
    <motion.div
      className={`w-75 ${className}`}
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="flex flex-row items-center justify-center ">
        <Image
          src="/assets/euDesenho.png"
          alt="Personagem"
          width={300}
          height={300}
          className="z-10 absolute h-75 w-75"
          priority
        />
        <div className="flex relative right-4 gap-2 top-4 ">
          <div className="flex relative top-[7px]">
            <Eye width={70} height={55} distance={20} />
          </div>
          <div className="flex relative top-[5px]">
            <Eye width={80} height={55} distance={25} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Run formatting check**

Run: `npm run lint:check`

Expected: it may fail because files were changed but not formatted, or pass if formatting is already correct.

- [ ] **Step 4: Format if needed**

Run: `npm run lint:fix`

Expected: Prettier formats changed files.

---

### Task 2: Build Desktop And Mobile Portfolio Layouts

**Files:**

- Modify: `pages/index.tsx`
- Modify: `styles/globals.css`

- [ ] **Step 1: Replace `pages/index.tsx` with the responsive portfolio implementation**

Use this complete implementation:

```tsx
import { motion, useDragControls } from "framer-motion";
import { PointerEvent, ReactNode, useState } from "react";
import Personagem from "./components/Personagem";

type PortfolioSection = {
  id: "about" | "skills" | "projects" | "resume";
  title: string;
  icon: string;
  message: string;
  content: ReactNode;
};

const defaultGuideMessage =
  "Bem-vindo ao meu desktop! Passe o mouse pelas pastas para explorar.";

const sections: PortfolioSection[] = [
  {
    id: "about",
    title: "Sobre mim",
    icon: "✦",
    message: "Um pouquinho sobre quem eu sou.",
    content: (
      <div className="space-y-3">
        <p>
          Sou uma pessoa desenvolvedora construindo interfaces com
          personalidade, cuidado visual e atenção à experiência de uso.
        </p>
        <p>
          Este espaço vai receber meus desenhos, projetos e detalhes da minha
          trajetória.
        </p>
      </div>
    ),
  },
  {
    id: "skills",
    title: "Conhecimentos",
    icon: "▣",
    message: "Essas são as ferramentas que eu uso para criar minhas ideias.",
    content: (
      <div className="grid gap-3 sm:grid-cols-2">
        {["React", "Next.js", "TypeScript", "Tailwind CSS"].map((skill) => (
          <span
            key={skill}
            className="rounded-2xl border-2 border-slate-900 bg-amber-100 px-4 py-3 font-bold shadow-[4px_4px_0_#0f172a]"
          >
            {skill}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "projects",
    title: "Projetos",
    icon: "★",
    message:
      "Aqui estão meus projetos. Por enquanto, deixei cartões temporários.",
    content: (
      <div className="grid gap-4 md:grid-cols-2">
        {["Projeto 01", "Projeto 02"].map((project) => (
          <article
            key={project}
            className="rounded-3xl border-2 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a]"
          >
            <h3 className="text-xl font-black text-slate-950">{project}</h3>
            <p className="mt-2 text-sm text-slate-700">
              Card temporário para depois receber descrição, imagem e links.
            </p>
            <button className="mt-4 rounded-full border-2 border-slate-900 bg-sky-300 px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]">
              Ver detalhes
            </button>
          </article>
        ))}
      </div>
    ),
  },
  {
    id: "resume",
    title: "Curriculo",
    icon: "◆",
    message: "Aqui fica minha trajetória em formato de currículo.",
    content: (
      <div className="space-y-4">
        <p>
          Resumo profissional temporário. Depois podemos adicionar experiências,
          formação e um arquivo para download.
        </p>
        <button className="rounded-full border-2 border-slate-900 bg-lime-300 px-5 py-3 font-black shadow-[4px_4px_0_#0f172a]">
          Baixar currículo em breve
        </button>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#7dd3fc] text-slate-950">
      <div className="hidden min-h-screen md:block">
        <DesktopPortfolio />
      </div>
      <div className="md:hidden">
        <MobilePortfolio />
      </div>
    </main>
  );
}

function DesktopPortfolio() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [guideMessage, setGuideMessage] = useState(defaultGuideMessage);
  const [topZIndex, setTopZIndex] = useState(20);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});

  function focusWindow(id: string) {
    setTopZIndex((current) => {
      const next = current + 1;
      setZIndexes((indexes) => ({ ...indexes, [id]: next }));
      return next;
    });
    setActiveWindow(id);
  }

  function openWindow(section: PortfolioSection) {
    setGuideMessage(section.message);
    setOpenWindows((current) =>
      current.includes(section.id) ? current : [...current, section.id],
    );
    focusWindow(section.id);
  }

  function closeWindow(id: string) {
    setOpenWindows((current) => current.filter((windowId) => windowId !== id));
    if (activeWindow === id) setActiveWindow(null);
  }

  return (
    <section className="relative min-h-screen overflow-hidden p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#fde68a_0_8%,transparent_8%_100%),radial-gradient(circle_at_80%_10%,#f9a8d4_0_10%,transparent_10%_100%),linear-gradient(135deg,#7dd3fc,#c4b5fd)]" />
      <div className="absolute bottom-6 left-8 right-8 top-8 rounded-[2rem] border-4 border-slate-950 bg-white/20 shadow-[10px_10px_0_rgba(15,23,42,0.35)]" />

      <div className="relative z-10 flex w-fit flex-col gap-7">
        {sections.map((section) => (
          <DesktopIcon
            key={section.id}
            section={section}
            onOpen={openWindow}
            onGuideMessage={setGuideMessage}
          />
        ))}
      </div>

      {sections
        .filter((section) => openWindows.includes(section.id))
        .map((section, index) => (
          <DraggableWindow
            key={section.id}
            section={section}
            index={index}
            zIndex={zIndexes[section.id] ?? 20 + index}
            onClose={closeWindow}
            onFocus={focusWindow}
          />
        ))}

      <CharacterGuide message={guideMessage} />
    </section>
  );
}

function DesktopIcon({
  section,
  onOpen,
  onGuideMessage,
}: {
  section: PortfolioSection;
  onOpen: (section: PortfolioSection) => void;
  onGuideMessage: (message: string) => void;
}) {
  return (
    <button
      type="button"
      className="group flex w-32 flex-col items-center gap-2 rounded-3xl p-3 text-center transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white"
      onClick={() => onOpen(section)}
      onMouseEnter={() => onGuideMessage(section.message)}
      onFocus={() => onGuideMessage(section.message)}
      onMouseLeave={() => onGuideMessage(defaultGuideMessage)}
      onBlur={() => onGuideMessage(defaultGuideMessage)}
      aria-label={`Abrir ${section.title}`}
    >
      <span className="grid h-20 w-24 place-items-center rounded-2xl border-4 border-slate-950 bg-yellow-300 text-4xl shadow-[6px_6px_0_#0f172a] transition group-hover:bg-pink-300">
        {section.icon}
      </span>
      <span className="rounded-full border-2 border-slate-950 bg-white px-3 py-1 text-sm font-black shadow-[3px_3px_0_#0f172a]">
        {section.title}
      </span>
    </button>
  );
}

function DraggableWindow({
  section,
  index,
  zIndex,
  onClose,
  onFocus,
}: {
  section: PortfolioSection;
  index: number;
  zIndex: number;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
}) {
  const dragControls = useDragControls();

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    onFocus(section.id);
    dragControls.start(event);
  }

  return (
    <motion.article
      className="absolute w-[min(680px,52vw)] overflow-hidden rounded-[1.75rem] border-4 border-slate-950 bg-rose-50 shadow-[10px_10px_0_#0f172a]"
      style={{ left: 210 + index * 34, top: 82 + index * 38, zIndex }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={() => onFocus(section.id)}
      aria-label={`Janela ${section.title}`}
    >
      <div
        className="flex cursor-grab items-center justify-between border-b-4 border-slate-950 bg-violet-300 px-5 py-3 active:cursor-grabbing"
        onPointerDown={startDrag}
      >
        <h2 className="font-black uppercase tracking-wide">{section.title}</h2>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-950 bg-red-300 font-black shadow-[2px_2px_0_#0f172a]"
          onClick={() => onClose(section.id)}
          aria-label={`Fechar ${section.title}`}
        >
          ×
        </button>
      </div>
      <div className="max-h-[58vh] overflow-auto bg-rose-50 p-6 text-base leading-relaxed">
        {section.content}
      </div>
    </motion.article>
  );
}

function CharacterGuide({ message }: { message: string }) {
  return (
    <aside className="pointer-events-none absolute bottom-8 right-8 z-[80] flex items-end gap-4">
      <div className="mb-36 max-w-72 rounded-[2rem] border-4 border-slate-950 bg-white px-5 py-4 text-lg font-black shadow-[6px_6px_0_#0f172a]">
        {message}
      </div>
      <Personagem className="scale-90" />
    </aside>
  );
}

function MobilePortfolio() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-300 via-violet-200 to-amber-100 px-5 py-8">
      <div className="rounded-[2rem] border-4 border-slate-950 bg-white/80 p-5 shadow-[7px_7px_0_#0f172a]">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-700">
          Portfolio OS
        </p>
        <h1 className="mt-3 text-4xl font-black leading-none">
          Meu portfolio em estilo cartoon
        </h1>
        <p className="mt-4 text-base font-semibold text-slate-700">
          No computador ele vira uma area de trabalho interativa. No celular,
          organizei tudo como uma landing page temática.
        </p>
        <div className="mt-8 flex justify-center">
          <Personagem className="scale-75" />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <article
            key={section.id}
            className="rounded-[2rem] border-4 border-slate-950 bg-rose-50 shadow-[7px_7px_0_#0f172a]"
          >
            <div className="flex items-center gap-3 border-b-4 border-slate-950 bg-yellow-300 px-5 py-4">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-slate-950 bg-white text-2xl font-black">
                {section.icon}
              </span>
              <div>
                <h2 className="text-xl font-black">{section.title}</h2>
                <p className="text-sm font-bold text-slate-700">
                  {section.message}
                </p>
              </div>
            </div>
            <div className="p-5">{section.content}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update global CSS**

Replace `styles/globals.css` with:

```css
@import "tailwindcss";

* {
  box-sizing: border-box;
}

html,
body,
#__next {
  min-height: 100%;
}

body {
  margin: 0;
  background: #7dd3fc;
}

button {
  font: inherit;
}
```

- [ ] **Step 3: Format files**

Run: `npm run lint:fix`

Expected: Prettier formats `pages/index.tsx`, character files, and CSS.

- [ ] **Step 4: Run verification**

Run: `npm run lint:check`

Expected: `All matched files use Prettier code style!`

Run: `npm test`

Expected: existing Jest tests pass, or Jest reports that no tests exist. If Jest fails due missing React test setup, do not add large test infrastructure in this task; report the gap.

---

### Task 3: Manual UI Verification

**Files:**

- No file changes unless verification finds a defect.

- [ ] **Step 1: Start development server**

Run: `npm run dev`

Expected: Next.js starts successfully and prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 2: Verify desktop behavior**

At a desktop viewport width:

- Confirm icons for `Sobre mim`, `Conhecimentos`, `Projetos`, and `Curriculo` are visible.
- Hover each icon and confirm the speech bubble text changes.
- Click each icon and confirm a window opens.
- Click an open icon again and confirm the existing window comes forward rather than duplicating.
- Drag a window by its title bar and confirm the body is not the drag handle.
- Close a window and confirm it disappears.

- [ ] **Step 3: Verify mobile behavior**

At a mobile viewport width:

- Confirm the OS desktop icons are hidden.
- Confirm the landing hero is visible.
- Confirm each section renders as a stacked cartoon card.
- Confirm no interaction requires hover.

- [ ] **Step 4: Stop the development server**

Stop the running `npm run dev` process with Ctrl+C in the terminal where it is running.

---

## Self-Review

- Spec coverage: desktop OS, draggable windows, mobile landing, character guide, placeholder content, accessibility, component placement outside `pages/`, and verification are covered by Tasks 1-3.
- Placeholder scan: placeholder portfolio content is intentional and explicitly required by the spec until final drawings/projects are available. No implementation steps contain `TBD` or undefined tasks.
- Type consistency: `PortfolioSection.id`, `openWindows`, `zIndexes`, and component props consistently use string IDs from the same union type.
