import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "KartAI AI-modeller",
  description: "Dette er en tjeneste som viser hvordan de ulike KI-assistentene til Norkart kan brukes til å effektivisere og hjelpe innbyggere og saksbehandlere med byggesøknader.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Navbar/>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Footer/>
      </body>
    </html>
  );
}
