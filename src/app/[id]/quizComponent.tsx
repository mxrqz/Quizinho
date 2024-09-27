"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { MoonStar, Sun } from "lucide-react";

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

    return (
        <>
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