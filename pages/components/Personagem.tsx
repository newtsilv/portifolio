import Eye from "./Eye";
import Image from "next/image";
import { motion } from "framer-motion";
export default function Personagem() {
  return (
    <motion.div
      className="w-75"
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
