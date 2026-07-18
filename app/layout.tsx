import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Smart Todo",
  description: "Single-user smart todo app with AI draft review flow"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
