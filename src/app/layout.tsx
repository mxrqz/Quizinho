import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizinho - Crie um Quiz para Seu Amor 💖",
  description: "Crie um quiz divertido para quem você ama!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
