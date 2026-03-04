import { useEffect, useRef } from "react";
type EyeProps = {
  width: number;
  height: number;
  distance: number;
};

export default function Eye({ width, height, distance }: EyeProps) {
  const pupilRef = useRef<HTMLDivElement | null>(null);
  const eyeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!eyeRef.current || !pupilRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Limite real baseado no tamanho do olho
      const maxMove = (width / 2) - (width * 0.3 / 2) - 5;

      const moveX = (deltaX / distance) * Math.min(distance, maxMove);
      const moveY = (deltaY / distance) * Math.min(distance, maxMove);

      pupilRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [width]);


  return (
    <div
      ref={eyeRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        ref={pupilRef}
        style={{
          width: "30px",
          height: "30px",
          background: "black",
          borderRadius: "50%",
          transition: "transform 0.05s linear",
        }}
      />
    </div>
  );
}