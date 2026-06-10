import type { PortfolioSection } from "../../types/portfolio";
import PortfolioSectionContent from "../portfolio/PortfolioSectionContent";

type MobileSectionCardProps = {
  section: PortfolioSection;
};

export default function MobileSectionCard({ section }: MobileSectionCardProps) {
  return (
    <article className="rounded-lg border-4 border-neutral-950 bg-[#f7f4ec] shadow-[7px_7px_0_#111]">
      <div className="flex items-center gap-3 border-b-4 border-neutral-950 bg-white px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-md border-2 border-neutral-950 bg-white text-xl font-black">
          {section.icon}
        </span>
        <div>
          <h2 className="text-xl font-black">{section.title}</h2>
          <p className="text-sm font-bold text-neutral-700">
            {section.message}
          </p>
        </div>
      </div>
      <div className="p-5">
        <PortfolioSectionContent sectionId={section.id} />
      </div>
    </article>
  );
}
