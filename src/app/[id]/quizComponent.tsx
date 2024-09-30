"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LogoSvg from "@/components/svg";
import { ChevronUp, Clipboard, MoonStar, Sun } from "lucide-react";
import * as qr from '@bitjson/qr-code'
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import SizedConfetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share'

interface Questions {
    question: string,
    alternatives: string[],
    correctAlternative: string
}

const QuizComponent = ({ quizinho }: { quizinho: Questions[] }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
    const [selectedAlternative, setSelectedAlternative] = React.useState<string>('');
    const [score, setScore] = React.useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState<boolean>(false)
    const currentQuestion = quizinho[currentQuestionIndex];
    const [currentUrl, setCurrentUrl] = React.useState<URL | null>(null);

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

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            qr.defineCustomElements(window);
        }
    }, []);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(new URL(window.location.href));
        }
    }, []);

    const { width, height } = useWindowSize()

    const QrCodeContainer = () => {
        return (
            currentUrl && (
                <div className="absolute hidden lg:flex flex-col items-center gap-5 rounded-t-xl bg-neutral-900 p-5 bottom-0 right-4 text-black transition-transform">
                    <div className="size-44 overflow-hidden bg-white rounded-md">
                        <div className="scale-110 translate-x-0.5 translate-y-0.5 relative">
                            <qr-code
                                contents={currentUrl.href}
                                squares
                            />
                        </div>
                    </div>

                    <div className="w-full flex justify-between flex-wrap">
                        <FacebookShareButton url={currentUrl.href}>
                            <FacebookIcon size={32} className="rounded-md" />
                        </FacebookShareButton>

                        <TelegramShareButton url={currentUrl.href}>
                            <TelegramIcon size={32} className="rounded-md" />
                        </TelegramShareButton>

                        <TwitterShareButton url={currentUrl.href}>
                            <XIcon size={32} className="rounded-md" />
                        </TwitterShareButton>

                        <LinkedinShareButton url={currentUrl.href}>
                            <LinkedinIcon size={32} className="rounded-md" />
                        </LinkedinShareButton>

                        <WhatsappShareButton url={currentUrl.href}>
                            <WhatsappIcon size={32} className="rounded-md" />
                        </WhatsappShareButton>
                    </div>

                    <a href={currentUrl.href} className="bg-white rounded-md text-center w-full py-2 flex gap-5 px-2 justify-between font-normal">
                        <span>{currentUrl.host}{currentUrl.pathname}</span>
                        <span><Clipboard /></span>
                    </a>
                </div>
            )
        )
    }

    return (
        <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
            <div className="absolute w-full h-full">
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
            </div>

            <nav className="flex justify-between items-center lg:items-end absolute left-0 w-full h-12 lg:h-24 top-0 pt-12 lg:pt-0 py-2 px-4 sm:px-12 lg:px-32 2xl:px-64 transition-all z-10">
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

            <div className="w-full h-full flex items-center justify-center py-2 px-4 sm:px-12 lg:px-32 2xl:px-64">
                {!isQuizCompleted ? (
                    <div className="flex flex-col w-full lg:w-1/2 gap-5 items-center relative">
                        <div className="border border-primary bg-background w-full h-full min-h-64 p-5 gap-5 flex flex-col items-center justify-center rounded-lg relative">
                            <h3 className="text-3xl font-semibold text-center relative text-pretty">
                                {currentQuestion.question}
                            </h3>

                            <RadioGroup onValueChange={handleAlternativeSelect} value={selectedAlternative} className="w-1/2 relative">
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
                                        <Label htmlFor={alt} className="cursor-pointer text-base w-full py-2">{alt}</Label>
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


            {currentUrl && (
                <Drawer>
                    <DrawerTrigger className="bg-foreground flex lg:hidden w-44 h-10 justify-center items-center z-20 absolute right-4 bottom-0 rounded-t-lg">
                        <ChevronUp className="text-background" />
                    </DrawerTrigger>

                    <DrawerContent className="flex justify-center items-center gap-5 rounded-t-xl bg-neutral-900 p-5 text-black">
                        <div className="w-full max-w-96 flex flex-col items-center gap-5">
                            <div className="size-44 overflow-hidden bg-white rounded-md">
                                <div className="scale-110 translate-x-0.5 translate-y-0.5 relative">
                                    <qr-code
                                        contents={currentUrl.href}
                                        squares
                                    />
                                </div>
                            </div>

                            <div className="w-full flex justify-between flex-wrap">
                                <FacebookShareButton url={currentUrl.href}>
                                    <FacebookIcon className="rounded-md" />
                                </FacebookShareButton>

                                <TelegramShareButton url={currentUrl.href}>
                                    <TelegramIcon className="rounded-md" />
                                </TelegramShareButton>

                                <TwitterShareButton url={currentUrl.href}>
                                    <XIcon className="rounded-md" />
                                </TwitterShareButton>

                                <LinkedinShareButton url={currentUrl.href}>
                                    <LinkedinIcon className="rounded-md" />
                                </LinkedinShareButton>

                                <WhatsappShareButton url={currentUrl.href}>
                                    <WhatsappIcon className="rounded-md" />
                                </WhatsappShareButton>
                            </div>

                            <a href={currentUrl.href} className="bg-white rounded-md text-center w-full py-2 flex px-2 justify-between font-normal">
                                <span>{currentUrl.host}{currentUrl.pathname}</span>
                                <span><Clipboard /></span>
                            </a>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}

            <QrCodeContainer />

        </div>
    );
};

export default QuizComponent

