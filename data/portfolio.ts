import type {
  PortfolioProject,
  PortfolioSection,
  Skill,
  SkillCategory,
} from "../types/portfolio";

/*
 * Todo o conteúdo do portfólio mora aqui. Os componentes só leem estes
 * dados — para adicionar um projeto, basta acrescentar um item em `projects`.
 * Itens marcados com TODO são placeholders esperando o conteúdo real.
 */

export const owner = {
  name: "Newthon Silveira Araujo",
  shortName: "Newt",
  role: "Desenvolvedor Frontend",
  location: "Brasil",
  // TODO: ajuste o status.
  status: "Aberto a oportunidades",
  bio: [
    "Sou um desenvolvedor construindo interfaces com personalidade, cuidado visual e atenção à experiência de uso.",
    "Este computador guarda meus projetos, desenhos e detalhes da minha trajetória.",
  ],
  // TODO: preencha formação, interesses e idiomas reais.
  education: [{ title: "Curso / instituição", detail: "Ano — ano" }],
  interests: ["Interfaces", "Desenho", "Web antiga"],
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "TODO" },
  ],
};

// TODO: troque pelos seus links reais.
export const contacts = {
  email: "seu-email@exemplo.com",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
};

export const defaultGuideMessage =
  "Bem-vindo ao meu computador! Clique duas vezes num ícone para abrir.";

export const portfolioSections: PortfolioSection[] = [
  {
    id: "about",
    title: "Sobre mim",
    windowTitle: "SOBRE_MIM",
    path: "C:\\Users\\newt\\sobre_mim",
    icon: "user",
    message: "Um pouquinho sobre quem eu sou.",
  },
  {
    id: "projects",
    title: "Projetos",
    windowTitle: "PROJETOS",
    path: "C:\\Users\\newt\\Projetos\\",
    icon: "folder",
    message: "Aqui ficam meus projetos. Cada um abre como um programa!",
  },
  {
    id: "skills",
    title: "Skills",
    windowTitle: "PROGRAMAS_INSTALADOS",
    path: "C:\\skills\\",
    icon: "chip",
    message: "As ferramentas que eu uso para criar minhas ideias.",
  },
  {
    id: "contact",
    title: "Contato",
    windowTitle: "CONTATO",
    path: "C:\\Users\\newt\\contato",
    icon: "mail",
    message: "Quer conversar? É por aqui.",
  },
  {
    id: "resume",
    title: "Currículo",
    windowTitle: "CURRICULO.TXT",
    path: "C:\\Users\\newt\\Documentos\\curriculo.txt",
    icon: "document",
    message: "Minha trajetória em formato de currículo.",
  },
];

export const skillCategories: { id: SkillCategory; label: string }[] = [
  { id: "frontend", label: "frontend" },
  { id: "styles", label: "styles" },
  { id: "tools", label: "tools" },
];

// TODO: revise a lista. As quatro primeiras vieram do portfólio antigo; as
// demais são usadas neste próprio site ou foram citadas como exemplo.
export const skills: Skill[] = [
  { name: "React", category: "frontend", note: "Componentes e interfaces" },
  { name: "Next.js", category: "frontend", note: "Aplicações e rotas" },
  { name: "TypeScript", category: "frontend", note: "Tipagem do front" },
  { name: "Tailwind CSS", category: "styles", note: "Estilos utilitários" },
  { name: "CSS", category: "styles", note: "Layout e animação" },
  { name: "Framer Motion", category: "frontend", note: "Animações de UI" },
  { name: "Three.js", category: "frontend", note: "3D no navegador" },
  { name: "Git", category: "tools", note: "Versionamento" },
];

export const projects: PortfolioProject[] = [
  {
    id: "oxyclass",
    title: "Oxyclass",
    keywords: ["CMS", "Aprendizagem", "Gamificação", "IA"],
    year: "2026",
    role: "Desenvolvedor Frontend",
    type: "Aplicação web",
    status: "Em desenvolvimento",
    shortDescription:
      "Plataforma educacional para gerenciamento e distribuição de conteúdos interativos.",
    description:
      "Plataforma criada para gerenciar e distribuir conteúdos interativos, unindo CMS, gamificação, ferramentas de aprendizagem, acompanhamento do progresso dos alunos e apoio por inteligência artificial.",
    participation:
      "Minha participação nesse projeto foi como desenvolvedor frontend.",
    // TODO: confirme quais destas responsabilidades foram suas.
    responsibilities: [
      "Desenvolvimento frontend",
      "Implementação de interfaces",
      "Componentes reutilizáveis",
      "Integração com APIs",
      "Interfaces responsivas",
      "Ajustes de UI",
    ],
    icon: { glyph: "OX", color: "royal" },
    // Imagens: coloque os arquivos em /public e preencha `src`.
    cover: { name: "cover.png", alt: "Visão geral da plataforma" },
    screenshots: [
      {
        name: "screen_01.png",
        alt: "Tela inicial do aluno",
        caption: "Ambiente do aluno",
      },
      {
        name: "screen_02.png",
        alt: "Slide interativo",
        caption: "Slides interativos",
      },
      {
        name: "screen_03.png",
        alt: "Progresso do aluno",
        caption: "Progresso",
      },
      {
        name: "screen_04.png",
        alt: "Painel administrativo",
        caption: "Ambiente administrativo",
      },
      {
        name: "screen_05.png",
        alt: "Editor de slides",
        caption: "Montagem de slides",
      },
    ],
    features: [
      "Gerenciamento de conteúdo",
      "Slides interativos",
      "Gamificação",
      "Acompanhamento dos alunos",
      "Apoio por IA",
    ],
    modules: [
      {
        title: "Ambiente do aluno",
        screenshot: 0,
        items: [
          "Acessar conteúdos",
          "Visualizar slides interativos",
          "Acompanhar o progresso",
          "Interagir com conteúdos gamificados",
        ],
      },
      {
        title: "Ambiente administrativo / funcionário",
        screenshot: 3,
        items: [
          "Cadastrar conteúdos",
          "Montar slides",
          "Organizar materiais",
          "Preparar conteúdos para os alunos",
        ],
      },
    ],
    // TODO: confira e complete a stack real.
    stack: [
      { label: "Framework", value: "Next.js" },
      { label: "Interface", value: "React" },
      { label: "Linguagem", value: "TypeScript" },
    ],
    // TODO: links reais (sem link, o botão aparece desabilitado).
  },
  {
    id: "projeto-02",
    title: "Projeto 02",
    year: "2026",
    role: "TODO",
    type: "TODO",
    status: "Em breve",
    shortDescription: "Espaço reservado para o próximo projeto.",
    description:
      "Texto temporário: descreva aqui o que é o projeto e para quem ele foi feito.",
    participation: "Texto temporário: explique qual foi a sua participação.",
    responsibilities: [],
    icon: { glyph: "02", color: "navy" },
    cover: { name: "cover.png", alt: "Capa do projeto 02" },
    screenshots: [
      { name: "screen_01.png", alt: "Captura de tela do projeto 02" },
    ],
    features: ["Funcionalidade 01", "Funcionalidade 02"],
    stack: [{ label: "Framework", value: "TODO" }],
  },
];

export function findProject(id: string) {
  return projects.find((project) => project.id === id);
}

export function findSection(id: string | null) {
  return portfolioSections.find((section) => section.id === id);
}
