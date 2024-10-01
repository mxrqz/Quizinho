import { cache } from 'react';
import { Metadata } from 'next';
import axios from 'axios';
import QuizComponent from "./quizComponent";
import Script from "next/script";

const serverURL = 'https://api.quizinho.me';
// const serverURL = 'http://localhost:3001'

const fetchQuizData = cache(async (id: string) => {
    const { quizinho, img, paid } = (await axios.get(`${serverURL}/get-quizinho/${id}`)).data
    return { quizinho, img, paid }
})

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const quizData = await fetchQuizData(params.id)

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

const QuizPage = async ({ params }: { params: { id: string } }) => {
    const quizData = await fetchQuizData(params.id);

    return (
        <>
            {!quizData.paid && (
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7551677366710429"
                    crossOrigin="anonymous"></Script>
            )}

            <QuizComponent quizinho={quizData.quizinho} />
        </>
    );
};

export default QuizPage;