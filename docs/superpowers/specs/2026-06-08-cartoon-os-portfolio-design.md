# Cartoon OS Portfolio Design

## Goal

Transform the current under-construction portfolio into a cartoon/retrô operating-system-inspired portfolio on desktop, with a simpler thematic landing page on mobile.

## Current Context

The project is a Next.js App Router app using TypeScript, Tailwind CSS, Framer Motion, and `next/image`. The home page is rendered by `app/page.tsx`, global styles are imported by `app/layout.tsx`, and reusable components live outside routing directories so Next.js does not expose them as routes.

## Desktop Experience

On `md` screens and larger, the home page becomes a cartoon desktop environment:

- A full-screen wallpaper-like background with temporary CSS illustration details.
- Desktop icons/folders for `Sobre mim`, `Conhecimentos`, `Projetos`, and `Curriculo`.
- Each icon opens an OS-style window.
- Windows are draggable from their title bars.
- Multiple windows can stay open at the same time.
- Clicking an already open window brings it to the front.
- Each window has a title bar and close button.
- Minimize/maximize are out of scope for the first implementation.

## Mobile Experience

On screens below `md`, the home page becomes a normal vertical landing page using the same visual identity:

- No draggable desktop windows.
- Sections are stacked vertically.
- Each section uses a card that resembles a cartoon OS window or open folder.
- The character appears as a guide, but the experience does not depend on hover.
- Helper messages appear as fixed section copy rather than hover-only tooltips.

## Character Guide

The existing character remains central to the desktop experience:

- On desktop, the character is fixed near the right side of the screen.
- A speech bubble appears near the character.
- Hovering or focusing interactive desktop elements updates the speech bubble message.
- Default message welcomes the visitor.
- On mobile, the character appears in the hero area with a fixed introductory message.

## Initial Content

The first implementation uses editable placeholder content:

- `Sobre mim`: short introduction.
- `Conhecimentos`: grouped technology skills.
- `Projetos`: temporary project cards.
- `Curriculo`: short resume summary and a placeholder action.

Temporary icons and visual decorations are acceptable. The implementation must keep content and image replacement easy so the user can later swap in their own drawings.

## Architecture

Keep the page implementation small and component-oriented:

- `app/layout.tsx` owns metadata and global styles.
- `app/page.tsx` chooses between desktop and mobile layouts with responsive Tailwind classes.
- Shared portfolio data lives in `data/portfolio.ts`.
- Shared portfolio types live in `types/portfolio.ts`.
- `DesktopPortfolio` owns open windows, active z-index, and guide messages.
- `MobilePortfolio` renders the same content as stacked sections.
- `DesktopIcon` renders a clickable/focusable folder shortcut.
- `DraggableWindow` renders and drags OS-style windows.
- `CharacterGuide` wraps the existing character and speech bubble.

## Accessibility And Interaction

- Desktop icons must be buttons.
- Windows must have accessible labels and close buttons.
- Hover messages must also update on keyboard focus.
- Mobile content must not rely on hover.
- Window dragging is a progressive enhancement; content remains readable even if drag is not used.

## Testing And Verification

- Add focused tests for opening, closing, and bringing desktop windows forward.
- Add tests that hover/focus updates the character guide message.
- Add tests that mobile sections render the expected content.
- Run the existing test script and Prettier check.

## Out Of Scope

- Real project data beyond placeholders.
- Final illustrations.
- Minimize/maximize window controls.
- Persisting window positions.
- Downloadable resume file unless an asset is provided.
