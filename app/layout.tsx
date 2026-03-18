import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpanishTalk – Practice Spain Spanish",
  description: "Voice-first Spain Spanish conversation practice for absolute beginners",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
