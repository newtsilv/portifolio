import type { PortfolioProject, PortfolioSection } from "../types/portfolio";

export const defaultGuideMessage =
  "Bem-vindo ao meu desktop! Passe o mouse pelas pastas para explorar.";

export const portfolioSections: PortfolioSection[] = [
  {
    id: "about",
    title: "Sobre mim",
    icon: "✦",
    message: "Um pouquinho sobre quem eu sou.",
  },
  {
    id: "skills",
    title: "Conhecimentos",
    icon: "▣",
    message: "Essas são as ferramentas que eu uso para criar minhas ideias.",
  },
  {
    id: "projects",
    title: "Projetos",
    icon: "★",
    message:
      "Aqui estão meus projetos. Por enquanto, deixei cartões temporários.",
  },
  {
    id: "resume",
    title: "Curriculo",
    icon: "◆",
    message: "Aqui fica minha trajetória em formato de currículo.",
  },
];

export const skills = ["React", "Next.js", "TypeScript", "Tailwind CSS"];

export const projects: PortfolioProject[] = [
  {
    title: "Projeto 01",
    description:
      "Card temporário para depois receber descrição, imagem e links.",
  },
  {
    title: "Projeto 02",
    description:
      "Card temporário para depois receber descrição, imagem e links.",
  },
];
