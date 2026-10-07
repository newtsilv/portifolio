declare module "*.css";

// O projeto não tem @types/react-dom; só usamos o createPortal.
declare module "react-dom" {
  import type { ReactNode, ReactPortal } from "react";
  export function createPortal(
    children: ReactNode,
    container: Element,
  ): ReactPortal;
}
