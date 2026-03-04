import Personagem from "./components/Personagem";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className=" h-screen w-screen flex flex-col md:flex-row items-center justify-center md:gap-20 gap-40 ">
      <h1 className="text-4xl font-bold text-white">site em construção</h1>

        <Personagem />
    </div>
  );
}
