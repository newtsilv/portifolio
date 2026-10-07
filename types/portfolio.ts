/** Programas/pastas do desktop. A ordem em `portfolioSections` é a dos ícones. */
export type PortfolioSectionId =
  | "about"
  | "projects"
  | "skills"
  | "contact"
  | "resume";

export type PortfolioSection = {
  id: PortfolioSectionId;
  /** Nome do ícone no desktop. */
  title: string;
  /** Título da janela (estilo nome de arquivo/programa). */
  windowTitle: string;
  /** Caminho mostrado na barra de endereço / tooltip. */
  path: string;
  icon: PixelIconName;
  /** Fala do personagem quando o ícone recebe hover/foco. */
  message: string;
};

export type PixelIconName =
  | "folder"
  | "user"
  | "chip"
  | "mail"
  | "document"
  | "note"
  | "image"
  | "computer"
  | "error"
  | "info"
  | "app";

/** Imagem de um projeto. Sem `src`, a interface mostra um placeholder. */
export type ProjectImage = {
  /** Nome de "arquivo" exibido na galeria (ex.: screen_01.png). */
  name: string;
  alt: string;
  /** Caminho em /public, ex.: "/assets/projects/edu/screen_01.png". */
  src?: string;
  caption?: string;
  width?: number;
  height?: number;
};

/** Ícone do "aplicativo". Sem `src`, desenha um ícone placeholder. */
export type ProjectIcon = {
  /** 1 a 2 letras exibidas no ícone placeholder. */
  glyph: string;
  /** Cor da barra do ícone placeholder. */
  color: "royal" | "navy" | "sky";
  /** Ícone próprio (png/svg 32x32 ou 48x48) em /public. */
  src?: string;
};

export type PortfolioProject = {
  /** Usado na URL: /projetos/<id>. */
  id: string;
  title: string;
  /** Título gigante da página do projeto, uma linha por item (padrão: o título). */
  headline?: string[];
  /** Palavras-chave pequenas sob o título (CMS / LEARNING / ...). */
  keywords?: string[];
  year: string;
  /** Meu papel no projeto (nunca presumir o projeto inteiro). */
  role: string;
  type: string;
  status: string;
  shortDescription: string;
  description: string;
  /** Texto explícito sobre a minha participação. */
  participation: string;
  responsibilities: string[];
  icon: ProjectIcon;
  cover: ProjectImage;
  screenshots: ProjectImage[];
  features: string[];
  /** Áreas/ambientes do produto, com o que cada um faz. */
  modules?: {
    title: string;
    items: string[];
    /** Índice em `screenshots` exibido junto do módulo. */
    screenshot?: number;
  }[];
  /** Tabela "propriedades": Framework → Next.js, etc. */
  stack: { label: string; value: string }[];
  github?: string;
  liveUrl?: string;
};

export type SkillCategory = "frontend" | "styles" | "tools";

export type Skill = {
  name: string;
  category: SkillCategory;
  /** Linha curta exibida na coluna de descrição. */
  note: string;
};
