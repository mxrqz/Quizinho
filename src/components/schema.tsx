import Script from 'next/script';

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Quizinho",
    "description": "Crie quizzes personalizados e divertidos de graça com o Quizinho. Compartilhe facilmente com quem você ama e descubra quem conhece mais sobre você!",
    "url": "https://quizinho.me",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "creator": {
      "@type": "Organization",
      "name": "Quizinho",
      "url": "https://quizinho.me"
    },
    "featureList": [
      "Criação de quizzes personalizados",
      "Compartilhamento via QR Code",
      "Interface responsiva",
      "Temas customizáveis",
      "URLs personalizadas"
    ],
    "browserRequirements": "HTML5, JavaScript",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "inLanguage": "pt-BR"
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Como criar um quiz personalizado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Para criar um quiz personalizado no Quizinho, basta acessar nossa plataforma, adicionar suas perguntas e alternativas, escolher a resposta correta e compartilhar o QR Code gerado automaticamente."
        }
      },
      {
        "@type": "Question",
        "name": "O Quizinho é gratuito?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! O Quizinho oferece um plano gratuito que permite criar quizzes com funcionalidades básicas. Também temos um plano Premium com recursos adicionais como temas customizados e URLs personalizadas."
        }
      },
      {
        "@type": "Question",
        "name": "Como compartilhar meu quiz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Após criar seu quiz, você receberá um QR Code único que pode ser compartilhado via WhatsApp, redes sociais ou qualquer meio de comunicação. As pessoas podem escanear o código para acessar seu quiz."
        }
      }
    ]
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}