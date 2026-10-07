"use client";

/**
 * Filtro "tela antiga" (CRT) aplicado por cima de toda a interface.
 *
 * É só CSS/SVG: um overlay fixo com scanlines, máscara de subpixel RGB,
 * vinheta, barra de varredura e uma camada de grão animada. Não usa canvas
 * nem loop de JS.
 *
 * Curvatura de tela: envolva o app numa div com `className="crt-curve"` para
 * usar o filtro SVG abaixo (opt-in, custa um pouco mais).
 */
export default function CrtOverlay() {
  return (
    <>
      <svg
        aria-hidden
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <filter id="crt-barrel">
          <feImage
            result="disp"
            xlinkHref="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='75%25'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23000000'/%3E%3C/radialGradient%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="disp"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="R"
          />
        </filter>
      </svg>

      <div className="crt-grain" aria-hidden />
      <div className="crt-overlay" aria-hidden />
    </>
  );
}
