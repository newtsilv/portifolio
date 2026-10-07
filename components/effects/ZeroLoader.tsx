type ZeroLoaderProps = {
  className?: string;
};

/**
 * Indicador de carregamento no mesmo motivo visual do resto do site: três
 * dígitos girando em loop entre "0" e "1", tipo um contador binário/relógio
 * de flip. Usado enquanto o personagem 3D (bundle do three.js + o .glb)
 * ainda não terminou de carregar.
 */
export default function ZeroLoader({ className }: ZeroLoaderProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`flex items-center justify-center gap-1 font-black text-3xl text-ink ${className ?? ""}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="zero-loader-flip"
          style={{ animationDelay: `${i * 0.18}s` }}
        >
          <span className="zero-loader-face">0</span>
          <span
            className="zero-loader-face zero-loader-face-back"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            1
          </span>
        </span>
      ))}
    </div>
  );
}
