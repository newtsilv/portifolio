export type PortfolioSectionId = "about" | "skills" | "projects" | "resume";

export type PortfolioProject = {
  title: string;
  description: string;
};

export type PortfolioSection = {
  id: PortfolioSectionId;
  title: string;
  icon: string;
  message: string;
};
