import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
      <head>
        <meta name="google-adsense-account" content="ca-pub-7551677366710429" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7551677366710429"
          crossOrigin="anonymous"></Script>
      </head>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
