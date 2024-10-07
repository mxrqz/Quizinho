import type { Metadata } from "next";
import "./globals.css";
// import Script from "next/script";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Quizinho - Crie um Quiz de graça para quem você ama!",
  description: "Crie quizzes personalizados e divertidos de graça com o Quizinho. Compartilhe facilmente com quem você ama e descubra quem conhece mais sobre você!",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "Quizinho - Crie um Quiz de graça para quem você ama!",
    description: "Crie quizzes personalizados e divertidos de graça com o Quizinho. Compartilhe facilmente com quem você ama e descubra quem conhece mais sobre você!",
    url: "https://quizinho.me",
    siteName: "Quizinho",
    images: [
      {
        url: "/quizinho-logo-alt.png", // URL de uma imagem representativa
        width: 500,
        height: 500,
        alt: "Imagem do Quizinho",
      }
    ],
    locale: "pt_BR",
    type: "website",
  },
  alternates: {
    canonical: "https://quizinho.me",
  },
  icons: {
    icon: "/quizinho-light-purple.svg",
  },
  keywords: ["quiz", "amor", "diversão", "jogos online"],
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
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7551677366710429"
          crossOrigin="anonymous"></Script> */}
      </head>
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}