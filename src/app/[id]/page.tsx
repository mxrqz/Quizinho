import React, { cache } from 'react'
import { Metadata } from 'next';
import axios from 'axios';
import QuizComponent from "./quizComponent";

const serverURL = 'https://quizinho-server.onrender.com';
// const serverURL = 'http://localhost:3001'

// async function fetchQuizData(id: string) {
//     const { quizinho, img } = (await axios.get(`${serverURL}/get-quizinho/${id}`)).data;
//     return { quizinho, img };
// }

const fetchQuizData = cache(async (id: string) => {
    const {quizinho, img} = (await axios.get(`${serverURL}/get-quizinho/${id}`)).data
    return {quizinho, img}
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
        <QuizComponent quizinho={quizData.quizinho} />
    );
};

export default QuizPage;