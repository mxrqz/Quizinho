import type { Metadata } from "next";
import "./globals.css";
// import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { WebsiteSchema, FAQSchema } from "@/components/schema";

export const metadata: Metadata = {
  title: "Quizinho - Crie um Quiz de graça para quem você ama!",
  description: "Crie quizzes personalizados e divertidos de graça com o Quizinho. Compartilhe facilmente com quem você ama e descubra quem conhece mais sobre você!",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Quizinho - Crie um Quiz de graça para quem você ama!",
    description: "Crie quizzes personalizados e divertidos de graça com o Quizinho. Compartilhe facilmente com quem você ama e descubra quem conhece mais sobre você!",
    url: "https://quizinho.me",
    siteName: "Quizinho",
    images: [
      {
        url: "/quizinho-logo-alt.png",
        width: 1200,
        height: 630,
        alt: "Quizinho - Crie quizzes personalizados para quem você ama",
      }
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quizinho - Crie um Quiz de graça para quem você ama!",
    description: "Crie quizzes personalizados e divertidos de graça com o Quizinho. Compartilhe facilmente com quem você ama e descubra quem conhece mais sobre você!",
    images: ["/quizinho-logo-alt.png"],
  },
  alternates: {
    canonical: "https://quizinho.me",
  },
  icons: {
    icon: "/quizinho-light-purple.svg",
    apple: "/quizinho-light-purple.svg",
  },
  keywords: [
    "quiz personalizado",
    "criar quiz",
    "quiz de amor",
    "quiz casal",
    "quiz relacionamento",
    "quiz divertido",
    "jogar quiz",
    "quiz online grátis",
    "quiz namorado",
    "quiz namorada",
    "teste personalizado",
    "quiz romântico"
  ],
  authors: [{ name: "Quizinho" }],
  creator: "Quizinho",
  publisher: "Quizinho",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7551677366710429" />
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7551677366710429"
          crossOrigin="anonymous"></Script> */}
      </head>
      <body className={`antialiased`}>
        <WebsiteSchema />
        <FAQSchema />
        {children}
        <Toaster />
      </body>
    </html>
  );
}