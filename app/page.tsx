import DesktopPortfolio from "../components/desktop/DesktopPortfolio";
import MobilePortfolio from "../components/mobile/MobilePortfolio";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ec] text-neutral-950">
      <div className="hidden min-h-screen md:block">
        <DesktopPortfolio />
      </div>
      <div className="md:hidden">
        <MobilePortfolio />
      </div>
    </main>
  );
}
