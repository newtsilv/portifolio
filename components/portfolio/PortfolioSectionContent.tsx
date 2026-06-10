import { projects, skills } from "../../data/portfolio";
import type { PortfolioSectionId } from "../../types/portfolio";

type PortfolioSectionContentProps = {
  sectionId: PortfolioSectionId;
};

export default function PortfolioSectionContent({
  sectionId,
}: PortfolioSectionContentProps) {
  if (sectionId === "about") {
    return (
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
    );
  }

  if (sectionId === "skills") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border-2 border-neutral-950 bg-white px-4 py-3 font-bold shadow-[4px_4px_0_#111]"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (sectionId === "projects") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="-rotate-1 rounded-md border-2 border-neutral-950 bg-white p-4 shadow-[5px_5px_0_#111]"
          >
            <h3 className="text-xl font-black text-neutral-950">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-700">
              {project.description}
            </p>
            <button className="mt-4 rounded-md border-2 border-neutral-950 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5">
              Ver detalhes
            </button>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p>
        Resumo profissional temporário. Depois podemos adicionar experiências,
        formação e um arquivo para download.
      </p>
      <button className="rounded-md border-2 border-neutral-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#111] transition hover:-translate-y-0.5">
        Baixar currículo em breve
      </button>
    </div>
  );
}
