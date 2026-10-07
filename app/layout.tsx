import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import CrtOverlay from "../components/effects/CrtOverlay";
import { PageTransitionProvider } from "../components/transition/PageTransition";

// Pixel: menus, labels, title bars, botões. Mono: dados técnicos e caminhos.
// Sans: textos de leitura.
const pixel = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-pixel-face",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Newt OS · Portfolio",
  description:
    "Portfólio de Newthon Silveira Araujo em forma de computador pessoal retrô.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${pixel.variable} ${mono.variable} ${sans.variable}`}
    >
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
        <CrtOverlay />
      </body>
    </html>
  );
}
