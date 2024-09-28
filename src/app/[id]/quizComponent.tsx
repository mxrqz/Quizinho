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
    const [selectedAlternative, setSelectedAlternative] = React.useState<string>('');
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
            setSelectedAlternative('');
        } else {
            setIsQuizCompleted(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedAlternative('');
        } else {
            alert('Você está na primeira pergunta.');
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
        <div className="w-full h-screen bg-background flex flex-col">
            <div className="w-full h-full absolute top-0 left-0 flex items-center overflow-hidden blur-sm maskImageCircle">
                <ul className="w-full aspect-square grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] scale-125">
                    {Array.from({ length: (15 * 15) }).map((_, index) => (
                        <li key={index} className="border-b-2 border-r-2 dark:border-b dark:border-r border-[#cfbaf0] transition-all"></li>
                    ))}
                </ul>

                <img src="./blob_gradient.png" alt="blob" className="absolute left-1/2 -translate-x-1/2 blur-2xl" />
            </div>

            <nav className="flex justify-between absolute items-center w-full h-36 top-0 py-2 px-32 2xl:px-64 transition-all">
                <a href="/">
                    <div className="flex gap-5 items-center">
                        <LogoSvg size={36} className="fill-foreground transition-all" />
                        <h1 className="text-3xl font-semibold text-foreground transition-all">Quizinho</h1>
                    </div>
                </a>

                <div>
                    {darkMode ? (
                        <MoonStar className="text-foreground transition-all" cursor={'pointer'} onClick={() => setMode('light')} />
                    ) : (
                        <Sun className="text-foreground transition-all" cursor={'pointer'} onClick={() => setMode('dark')} />
                    )}
                </div>
            </nav>

            <div className="w-full h-full flex items-center justify-center">
                {!isQuizCompleted ? (
                    <div className="flex flex-col w-1/2 gap-5 items-center relative">
                        <div className="border border-primary bg-background w-full h-full min-h-64 p-5 gap-5 flex flex-col items-center justify-center rounded-lg relative">
                            <h3 className="text-3xl font-semibold text-center relative text-pretty">
                                {currentQuestion.question}
                            </h3>

                            <RadioGroup onValueChange={handleAlternativeSelect} value={selectedAlternative} className="w-1/2 relative">
                                {currentQuestion.alternatives.map((alt, index) => (
                                    <div key={index} className={`flex justify-start items-center gap-2 w-full border border-foreground px-5 rounded-lg transition-all
                                    ${selectedAlternative === alt.alternative ? 'bg-[#cfbaf0] dark:text-background' : ''}`}
                                    >
                                        <RadioGroupItem
                                            className="border-foreground text-foreground data-[state=checked]:text-foreground data-[state=checked]:border-foreground
                                            dark:data-[state=checked]:text-background dark:data-[state=checked]:border-background
                                        "
                                            value={alt.alternative}
                                            id={alt.alternative}
                                            checked={selectedAlternative === alt.alternative ? true : false}
                                        />
                                        <Label htmlFor={alt.alternative} className="cursor-pointer text-base w-full py-2">{alt.alternative}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="relative bg-background border border-primary rounded-full p-2 w-1/2 flex justify-between gap-2">
                            <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="rounded-full w-full bg-foreground hover:bg-foreground/80 text-background">
                                Anterior
                            </Button>

                            <Button onClick={handleNextQuestion} disabled={!selectedAlternative} className="rounded-full w-full bg-foreground hover:bg-foreground/80 text-background">
                                {currentQuestionIndex + 1 < quizinho.length ? 'Proxima' : 'Finalizar'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border border-primary bg-background w-1/2 h-fit min-h-64 p-5 gap-5 flex flex-col items-center justify-center rounded-lg relative">
                        <h2>Quiz finalizado!</h2>
                        <p>Você acertou {score} de {quizinho.length} perguntas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizComponent