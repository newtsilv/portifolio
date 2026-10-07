import type { PixelIconName } from "../../types/portfolio";

/**
 * Ícones em pixel art 16x16, desenhados a partir de "mapas" de caracteres.
 * Cada letra é uma cor da paleta; "." é transparente. Os pixels viram
 * retângulos SVG agrupados por linha, então escalam sem borrar.
 */

const PALETTE: Record<string, string> = {
  k: "var(--color-ink)",
  n: "var(--color-navy)",
  r: "var(--color-royal)",
  s: "var(--color-sky)",
  m: "var(--color-mist)",
  w: "var(--color-paper)",
  g: "var(--color-steel)",
};

const E = "................";

const MAPS: Record<PixelIconName, string[]> = {
  folder: [
    E,
    E,
    E,
    ".kkkkk..........",
    "kssssskkkkkkkkkk",
    "kssssssssssssssk",
    "kkkkkkkkkkkkkkkk",
    "krsssrrrrrrrrrrk",
    "krrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrk",
    "kkkkkkkkkkkkkkkk",
    E,
    E,
  ],
  user: [
    E,
    ".....kkkkkk.....",
    "....kssssssk....",
    "...kssssssssk...",
    "...kssksskssk...",
    "...kssssssssk...",
    "...ksskkkkssk...",
    "....kssssssk....",
    ".....kkkkkk.....",
    "...kkrrrrrrkk...",
    "..krrrrrrrrrrk..",
    ".krrrrwwwwrrrrk.",
    ".krrrrrwwrrrrrk.",
    ".krrrrrrrrrrrrk.",
    ".kkkkkkkkkkkkkk.",
    E,
  ],
  chip: [
    E,
    "....k.k..k.k....",
    "....k.k..k.k....",
    "..kkkkkkkkkkkk..",
    "..knnnnnnnnnnk..",
    "kkknrrrrrrrrnkkk",
    "..knrssrrrrrnk..",
    "kkknrsrrrrrrnkkk",
    "..knrrrrrrrrnk..",
    "kkknrrrrrrrrnkkk",
    "..knnnnnnnnnnk..",
    "..kkkkkkkkkkkk..",
    "....k.k..k.k....",
    "....k.k..k.k....",
    E,
    E,
  ],
  mail: [
    E,
    E,
    E,
    ".kkkkkkkkkkkkkk.",
    ".kkwwwwwwwwwwkk.",
    ".kwkwwwwwwwwkwk.",
    ".kwwkwwwwwwkwwk.",
    ".kwwwkwwwwkwwwk.",
    ".kwwwwkrrkwwwwk.",
    ".kwwwwwkkwwwwwk.",
    ".kwwwwwwwwwwwwk.",
    ".kwwwwwwwwwwwwk.",
    ".kkkkkkkkkkkkkk.",
    E,
    E,
    E,
  ],
  document: [
    E,
    "...kkkkkkkk.....",
    "...kwwwwwwkk....",
    "...kwwwwwwkwk...",
    "...kwwwwwwkkkk..",
    "...kwwwwwwwwwk..",
    "...kwrrrrrrwwk..",
    "...kwwwwwwwwwk..",
    "...kwssssssswk..",
    "...kwwwwwwwwwk..",
    "...kwsssssswwk..",
    "...kwwwwwwwwwk..",
    "...kwssssswwwk..",
    "...kwwwwwwwwwk..",
    "...kkkkkkkkkkk..",
    E,
  ],
  note: [
    E,
    "..kkkkkkkkkkkk..",
    "..krrrrrrrrrrk..",
    "..kkkkkkkkkkkk..",
    "..kwwwwwwwwwwk..",
    "..kwnnnnnnnnwk..",
    "..kwwwwwwwwwwk..",
    "..kwnnnnnnwwwk..",
    "..kwwwwwwwwwwk..",
    "..kwnnnnnnnnwk..",
    "..kwwwwwwwwwwk..",
    "..kwnnnnwwwwwk..",
    "..kwwwwwwwwwwk..",
    "..kkkkkkkkkkkk..",
    E,
    E,
  ],
  image: [
    E,
    E,
    ".kkkkkkkkkkkkkk.",
    ".kssssssssssssk.",
    ".ksssssssswwssk.",
    ".ksssssssswwssk.",
    ".kssssssssssssk.",
    ".ksssssrssssssk.",
    ".kssssrrrsssssk.",
    ".ksssrrrrrsnssk.",
    ".kssrrrrrrrnnnk.",
    ".ksrrrrrrrrnnnk.",
    ".krrrrrrrrrnnnk.",
    ".kkkkkkkkkkkkkk.",
    E,
    E,
  ],
  computer: [
    E,
    ".kkkkkkkkkkkkk..",
    ".knnnnnnnnnnnk..",
    ".knrrrrrrrrrnk..",
    ".knrsrrrrrrrnk..",
    ".knrrrrrrrrrnk..",
    ".knrrrrrrrrrnk..",
    ".knnnnnnnnnnnk..",
    ".kkkkkkkkkkkkk..",
    ".....kkkkk......",
    "...kkkkkkkkk....",
    "..kgggggggggk...",
    "..kkkkkkkkkkk...",
    E,
    E,
    E,
  ],
  error: [
    E,
    ".....kkkkkk.....",
    "...kkrrrrrrkk...",
    "..krrrrrrrrrrk..",
    ".krrwwrrrrwwrrk.",
    ".krrrwwrrwwrrrk.",
    "krrrrrwwwwrrrrrk",
    "krrrrrwwwwrrrrrk",
    ".krrrwwrrwwrrrk.",
    ".krrwwrrrrwwrrk.",
    "..krrrrrrrrrrk..",
    "...kkrrrrrrkk...",
    ".....kkkkkk.....",
    E,
    E,
    E,
  ],
  info: [
    E,
    ".....kkkkkk.....",
    "...kkrrrrrrkk...",
    "..krrrrwwrrrrk..",
    ".krrrrrwwrrrrrk.",
    ".krrrrrrrrrrrrk.",
    "krrrrrwwwrrrrrrk",
    "krrrrrrwwrrrrrrk",
    ".krrrrrwwrrrrrk.",
    ".krrrrrwwrrrrrk.",
    "..krrrwwwwrrrk..",
    "...kkrrrrrrkk...",
    ".....kkkkkk.....",
    E,
    E,
    E,
  ],
  app: [
    E,
    ".kkkkkkkkkkkkkk.",
    ".krrrrrrrrrwrwk.",
    ".kkkkkkkkkkkkkk.",
    ".kwwwwwwwwwwwwk.",
    ".kwssswwwwwwwwk.",
    ".kwssswnnnnnnwk.",
    ".kwssswwwwwwwwk.",
    ".kwwwwwnnnnwwwk.",
    ".kwwwwwwwwwwwwk.",
    ".kwnnnnnnnnnnwk.",
    ".kwwwwwwwwwwwwk.",
    ".kkkkkkkkkkkkkk.",
    E,
    E,
    E,
  ],
};

type Run = { x: number; y: number; w: number; fill: string };

/** Agrupa pixels vizinhos da mesma cor em um único retângulo. */
function toRuns(map: string[]): Run[] {
  const runs: Run[] = [];
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x] ?? ".";
      let end = x + 1;
      while (row[end] === char) end++;
      const fill = PALETTE[char];
      if (fill) runs.push({ x, y, w: end - x, fill });
      x = end;
    }
  });
  return runs;
}

const RUNS = Object.fromEntries(
  Object.entries(MAPS).map(([name, map]) => [name, toRuns(map)]),
) as Record<PixelIconName, Run[]>;

export default function PixelIcon({
  name,
  size = 32,
  className,
}: {
  name: PixelIconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={`shrink-0 ${className ?? ""}`}
    >
      {RUNS[name].map((run, i) => (
        <rect
          key={i}
          x={run.x}
          y={run.y}
          width={run.w}
          height={1}
          fill={run.fill}
        />
      ))}
    </svg>
  );
}
