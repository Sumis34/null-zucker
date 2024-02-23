import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "#null-zucker",
  description:
    "null-zucker is a barcode scanning app that helps users quickly identify sugar-free products by scanning their barcodes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/Avocado.svg" sizes="any" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
