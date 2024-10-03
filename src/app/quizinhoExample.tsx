import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { StarsBackground } from "@/components/ui/stars-background";
// import { ShootingStars } from "@/components/ui/shooting-stars";
import SizedConfetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

interface Questions {
    question: string,
    alternatives: string[],
    correctAlternative: string
}

const quizinho: Questions[] = [
    {
        "question": "Você sabia que da para mudar o tema do seu Quizinho com o plano Premium?",
        "correctAlternative": "Sim!",
        "alternatives": [
            "Sim!",
            "Não!"
        ]
    },
    {
        "question": "Com o plano Premium você tem muitas vantagens",
        "correctAlternative": "Vários tipos de questões",
        "alternatives": [
            "Varios temas para selecionar",
            "URL customizável",
            "Quizinho sem anúncios",
            "Vários tipos de questões"
        ]
    }
]

const QuizinhoExample = ({className}: {className?: string}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
    const [selectedAlternative, setSelectedAlternative] = React.useState<string>('');
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

        const isCorrect = currentQuestion.correctAlternative === selectedAlternative

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

    const { width, height } = useWindowSize()

    return (
        <div className={className}>
            {/* <div className="absolute w-full h-full">
                <div className="hidden dark:inline">
                    <ShootingStars />
                    <StarsBackground starDensity={0.00025} twinkleProbability={0.4} />
                </div>

                <div className="w-full h-full absolute top-0 left-0 flex items-center overflow-hidden blur-[2px] maskImageCircle dark:hidden">
                    <ul className="w-full aspect-square grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] scale-125">
                        {Array.from({ length: (15 * 15) }).map((_, index) => (
                            <li key={index} className="border-b-2 border-r-2 dark:border-b dark:border-r border-[#cfbaf0] transition-all"></li>
                        ))}
                    </ul>

                    <img src="./blob_gradient.png" alt="blob" className="absolute left-1/2 -translate-x-1/2 blur-2xl dark:opacity-10" />
                </div>
            </div> */}

            <div className="w-full h-full flex items-center justify-center p-5">
                {!isQuizCompleted ? (
                    <div className="flex flex-col w-full gap-5 items-center relative">
                        <div className="border border-primary bg-background w-full h-full p-5 gap-5 flex flex-col items-center justify-center rounded-lg relative">
                            <h3 className="text-xl font-semibold text-center relative text-pretty">
                                {currentQuestion.question}
                            </h3>

                            <RadioGroup onValueChange={handleAlternativeSelect} value={selectedAlternative} className="grid grid-cols-2 relative">
                                {currentQuestion.alternatives.map((alt, index) => (
                                    <div key={index} className={`flex justify-start items-center gap-2 w-full border border-foreground px-5 rounded-lg transition-all
                                    ${selectedAlternative === alt ? 'bg-[#cfbaf0] dark:text-background' : ''}`}
                                    >
                                        <RadioGroupItem
                                            className="border-foreground text-foreground data-[state=checked]:text-foreground data-[state=checked]:border-foreground
                                            dark:data-[state=checked]:text-background dark:data-[state=checked]:border-background
                                        "
                                            value={alt}
                                            id={alt}
                                            checked={selectedAlternative === alt ? true : false}
                                        />
                                        <Label htmlFor={alt} className="cursor-pointer text-sm w-full py-2">{alt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="relative bg-background border border-primary rounded-full p-2 w-full lg:w-1/2 flex justify-between gap-2">
                            <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="rounded-full w-full bg-foreground hover:bg-foreground/80 text-background">
                                Anterior
                            </Button>

                            <Button onClick={handleNextQuestion} disabled={!selectedAlternative} className="rounded-full w-full bg-foreground hover:bg-foreground/80 text-background">
                                {currentQuestionIndex + 1 < quizinho.length ? 'Proxima' : 'Finalizar'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border border-primary bg-background w-full lg:w-1/2 h-fit min-h-64 p-5 gap-5 flex flex-col items-center justify-center rounded-lg relative">
                        <SizedConfetti
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                zIndex: 9999
                            }}
                            width={width}
                            height={height}
                            recycle={false}
                            numberOfPieces={25}
                            confettiSource={{
                                w: 10,
                                h: 10,
                                x: width / 2,
                                y: height / 2,
                            }}
                        />
                        <h3 className="text-3xl font-semibold text-center relative text-pretty">Quiz finalizado!</h3>
                        <p className="text-base">Você acertou {score} de {quizinho.length} perguntas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizinhoExample;