// src/app/teste/[id]/page.tsx
import React from 'react'
import { Metadata } from 'next';
import axios from 'axios';
import LogoSvg from "@/components/svg";
import QuizComponent from "./quizComponent";

interface Alternative {
    alternative: string;
    correct: boolean;
}

interface Question {
    question: string;
    alternatives: Alternative[];
}

const serverURL = 'https://quizinho-server.onrender.com';

async function fetchQuizData(id: string): Promise<Question[]> {
    const response = await axios.get(`${serverURL}/get-quizinho/${id}`);
    return response.data.quizinho;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    return {
        title: `Quiz ${params.id}`,
        description: `Participa do quiz ${params.id}`
    };
}

const QuizPage = async ({ params }: { params: { id: string } }) => {
    const quizinho = await fetchQuizData(params.id);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
            <nav className="flex justify-between items-center absolute w-full top-0 py-2 bg-[#cfbaf0] backdrop-blur px-32 2xl:px-64">
                <a href="/">
                    <div className="flex gap-5 items-center">
                        <LogoSvg size={36} className="fill-white" />
                        <h1 className="text-3xl font-semibold text-white">Quizinho</h1>
                    </div>
                </a>
            </nav>

            <QuizComponent quizinho={quizinho} />
        </div>
    );
};

export default QuizPage;