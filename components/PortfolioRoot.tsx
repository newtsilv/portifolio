import Desktop from "./desktop/Desktop";
import {
  CHARACTER_MODEL_URL,
  DRACO_DECODER_PATH,
} from "../lib/characterAssets";

/**
 * Raiz do portfólio: um único desktop responsivo (no celular as janelas
 * ocupam a tela; no computador ficam livres e arrastáveis).
 */
export default function PortfolioRoot() {
  return (
    <main>
      <Desktop />

      {/* Começa a baixar o modelo 3D e o decoder Draco junto com o HTML, em
          vez de esperar o JS do three.js carregar para só então pedir. */}
      <link
        rel="preload"
        href={CHARACTER_MODEL_URL}
        as="fetch"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href={`${DRACO_DECODER_PATH}draco_wasm_wrapper.js`}
        as="fetch"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href={`${DRACO_DECODER_PATH}draco_decoder.wasm`}
        as="fetch"
        crossOrigin="anonymous"
      />
    </main>
  );
}
