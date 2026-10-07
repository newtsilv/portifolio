"use client";

import { useEffect, useState } from "react";

const MONTHS = [
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

/** Hora e data da bandeja da taskbar. `null` até montar (evita erro de hidratação). */
export function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const interval = setInterval(update, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  return {
    time: now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    date: `${String(now.getDate()).padStart(2, "0")} ${MONTHS[now.getMonth()]}`,
    iso: now.toISOString(),
  };
}
