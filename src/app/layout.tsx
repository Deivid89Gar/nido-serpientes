import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nido Reptiles | Serpientes con cuidado responsable",
  description:
    "Conoce serpientes fascinantes, explora sus cuidados y encuentra orientación experta para darles un hogar responsable.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
