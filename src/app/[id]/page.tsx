// src/app/teste/[id]/page.tsx
import React from 'react'
import { Metadata } from 'next';
import axios from 'axios';
import QuizComponent from "./quizComponent";

// interface Alternative {
//     alternative: string;
//     correct: boolean;
// }

// interface Question {
//     question: string;
//     alternatives: Alternative[];
// }

// const serverURL = 'https://quizinho-server.onrender.com';


const serverURL = 'http://localhost:3001'

async function fetchQuizData(id: string, type: string) {
    const { quizinho, qrCode } = (await axios.get(`${serverURL}/get-quizinho/${id}`)).data;

    if (type === 'quizinho') {
        return quizinho
    } else if (type === 'qrCode') {
        return qrCode
    }

    return quizinho
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const qrCode = await fetchQuizData(params.id, "qrCode")

    return {
        title: `Quiz ${params.id}`,
        description: `Participa do quiz ${params.id}`,
        openGraph: {
            title: `Teste ${params.id}`,
            description: `Participe do quiz ${params.id}`,
            images: qrCode,
        },
    };
}

const QuizPage = async ({ params }: { params: { id: string } }) => {
    const quizinho = (await fetchQuizData(params.id, "quizinho")).quizinho;

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
            <QuizComponent quizinho={quizinho} />
        </div>
    );
};

export default QuizPage;