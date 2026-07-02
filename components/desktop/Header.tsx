"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [agora, setAgora] = useState(new Date());

  useEffect(() => {
    const atualizar = () => setAgora(new Date());

    atualizar(); // Atualiza imediatamente

    const interval = setInterval(atualizar, 60 * 1000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  const dia = agora.getDate().toString().padStart(2, "0");

  const meses = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  const data = `${dia} DE ${meses[agora.getMonth()]}`;

  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <header className="absolute top-0 w-full flex items-center justify-between bg-neutral-950 px-10 py-2 text-sm font-bold text-white">
      <span>Newthon Silveira Araujo</span>
      <div>
        <span className="mr-3">{data}</span>
        <span>{hora}</span>
      </div>
    </header>
  );
}
