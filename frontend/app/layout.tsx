import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
export const metadata: Metadata = {
  title: "CodeCompiler",
  description: "Generated by create next app",
};
const lucy = localFont({
  src: "/fonts/Pacifico-Regular.ttf",
  variable: "--font-lucy",
});
const rethink = localFont({
  src: [
    {
      path: "/fonts/Product Sans Regular.ttf",
    },
    {
      path: "/fonts/Product Sans Italic.ttf",
      style: "italic",
    },
    {
      path: "/fonts/Product Sans Bold.ttf",
      weight: "bold",
    },
    {
      path: "/fonts/Product Sans Bold Italic.ttf",
      weight: "bold",
      style: "italic",
    },
  ],
  variable: "--font-rethink",
});
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lucy.variable}  ${rethink.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
