"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LogoSvg from "@/components/svg";
import { MoonStar, Sun } from "lucide-react";

interface Alternative {
    alternative: string;
    correct: boolean;
}

interface Question {
    question: string;
    alternatives: Alternative[];
}

const QuizComponent = ({ quizinho }: { quizinho: Question[] }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
    const [selectedAlternative, setSelectedAlternative] = React.useState<string | null>(null);
    const [score, setScore] = React.useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState<boolean>(false)

    const currentQuestion = quizinho[currentQuestionIndex];

    const handleAlternativeSelect = (alternative: string) => {
        setSelectedAlternative(alternative);
    };

    const handleNextQuestion = () => {
        if (selectedAlternative === null) {
            alert('Por favor, selecione uma alternativa antes de continuar.');
            return;
        }

        const isCorrect = currentQuestion.alternatives.find(
            (alt) => alt.alternative === selectedAlternative
        )?.correct;

        if (isCorrect) {
            setScore(score + 1);
        }

        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < quizinho.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedAlternative(null); // Reseta a seleção para a próxima pergunta
        } else {
            setIsQuizCompleted(true); // Terminar o quiz
        }
    };

    const setMode = (mode: "light" | "dark") => {
        localStorage.theme = mode

        if (mode === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        setDarkMode(!darkMode)
    }

    React.useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            setDarkMode(true)
        } else {
            document.documentElement.classList.remove('dark')
            setDarkMode(false)
        }
    }, [])

    return (
        <>
            <nav className="flex justify-between items-center absolute w-full top-0 py-2 bg-[#cfbaf0] backdrop-blur px-32 2xl:px-64">
                <a href="/">
                    <div className="flex gap-5 items-center">
                        <LogoSvg size={36} className="fill-white" />
                        <h1 className="text-3xl font-semibold text-white">Quizinho</h1>
                    </div>
                </a>

                <div>
                    {darkMode ? (
                        <MoonStar color="white" cursor={'pointer'} onClick={() => setMode('light')} />
                    ) : (
                        <Sun color="white" cursor={'pointer'} onClick={() => setMode('dark')} />
                    )}
                </div>
            </nav>

            {!isQuizCompleted ? (
                <>
                    <h3 className="text-3xl font-semibold text-center">{currentQuestion.question}</h3>
                    <RadioGroup onValueChange={handleAlternativeSelect} className="w-fit">
                        {currentQuestion.alternatives.map((alt, index) => (
                            <div key={index} className="flex justify-start items-center gap-2 w-full">
                                <RadioGroupItem
                                    value={alt.alternative}
                                    id={alt.alternative}
                                    checked={selectedAlternative === alt.alternative}
                                />
                                <Label htmlFor={alt.alternative} className="cursor-pointer text-xl">{alt.alternative}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <Button onClick={handleNextQuestion} disabled={!selectedAlternative}>
                        Próxima
                    </Button>
                </>
            ) : (
                <div>
                    <h2>Quiz finalizado!</h2>
                    <p>Você acertou {score} de {quizinho.length} perguntas.</p>
                </div>
            )}
        </>
    );
};

export default QuizComponent