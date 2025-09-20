import { cache } from 'react';
import { Metadata } from 'next';
import axios from 'axios';
import QuizComponent from "./quizComponent";
import Script from "next/script";

// Using internal Next.js API routes instead of external server
const fetchQuizData = cache(async (id: string) => {
    const { quizinho, img, paid, theme } = (await axios.get(`/api/get-quizinho/${id}`)).data
    return { quizinho, img, paid, theme }
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const quizData = await fetchQuizData(id)

    return {
        title: "Será que você acerta meu Quizinho?",
        description: "Tente responder e veja quantas você acerta!",
        openGraph: {
            title: "Será que você acerta meu Quizinho?",
            description: "Tente responder e veja quantas você acerta!",
            images: quizData.img,
        },
    };
}

const QuizPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const quizData = await fetchQuizData(id);

    return (
        <>
            {!quizData.paid && (
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7551677366710429"
                    crossOrigin="anonymous"></Script>
            )}

            <QuizComponent quizinho={quizData.quizinho} theme={quizData.theme} />
        </>
    );
};

export default QuizPage;