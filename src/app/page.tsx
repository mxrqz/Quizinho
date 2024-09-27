"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { ArrowRight, ArrowRightCircle, EllipsisVertical, MoonStar, Plus, Sun, Trash2, X } from "lucide-react";
import { ArrowRight, ArrowRightCircle, EllipsisVertical, MoonStar, Plus, Sun, Trash2 } from "lucide-react";

import LogoSvg from "@/components/svg";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
// import Loader from "./components/ui/loading";
// import axios from 'axios'
import * as qr from '@bitjson/qr-code'

// import useWindowSize from 'react-use/lib/useWindowSize'
// import SizedConfetti from 'react-confetti'

import { format } from 'date-fns'

// import { QRCodeSVG } from 'qrcode.react';

// import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton,  TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share'
import { WhatsappIcon, WhatsappShareButton } from 'react-share'
import Image from "next/image";


interface alternatives {
  alternative: string,
  correct: boolean
}

interface Questions {
  question: string,
  alternatives: alternatives[]
}

// const serverURL = 'https://quizinho-server.onrender.com'

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [inputHasValue, setInputHasValue] = useState<boolean>(false)

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setDarkMode(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      qr.defineCustomElements(window);
    }
  }, []);

  const setMode = (mode: "light" | "dark") => {
    localStorage.theme = mode

    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    setDarkMode(!darkMode)
  }

  const questionsAmount = 4

  const [questions, setQuestions] = useState<Questions[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Questions | null>(null);
  const [originalQuestion, setOriginalQuestion] = useState<Questions | null>(null);
  const [question, setQuestion] = useState<string>('')
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [checkboxes, setCheckboxes] = useState<boolean[]>(Array(questionsAmount).fill(false))
  // const [loading, setLoading] = useState<boolean>(false)
  // const [qrCodeURL, setQrCodeURL] = useState<string>('')

  const handleQuestionCreate = () => {
    if (!question || !alternatives) return
    const prevQuestions = [...questions]

    const alternativeWithCheckboxes = alternatives.map((alternative, index) => {
      return {
        alternative,
        correct: checkboxes[index]
      };
    });

    const newQuestion = {
      question,
      alternatives: alternativeWithCheckboxes
    }

    setQuestions([...prevQuestions, newQuestion])
    setQuestion('');
    setAlternatives(Array(questionsAmount).fill(''));
    setCheckboxes(Array(questionsAmount).fill(false))
  }

  const handleEditStart = (questionToEdit: Questions) => {
    setOriginalQuestion(questionToEdit);
    setEditingQuestion({ ...questionToEdit });
  };

  const handleEditConfirm = () => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.question === originalQuestion?.question ? (editingQuestion as Questions) : q
      )
    );
    setEditingQuestion(null);
    setOriginalQuestion(null);
  };

  const handleEditCancel = () => {
    setEditingQuestion(null);
    setOriginalQuestion(null);
  };

  // const handleCreateQuizinho = async () => {
  //   setLoading(true)
  //   const url = await (await axios.post(`${serverURL}/create-quizinho`, questions)).data
  //   setQrCodeURL(url)

  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1500);
  // }

  // const { width, height } = useWindowSize()

  const shareData = {
    title: 'Quizinho',
    text: 'Confira esse quiz incrível!',
    url: 'https://quizinho.me'
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Conteúdo compartilhado com sucesso');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  }

  return (
    <main className="flex flex-col gap-8 lg:gap-24 w-full">
      <nav className="flex justify-between items-center sticky top-0 py-2 bg-[#cfbaf0] backdrop-blur px-4 sm:px-12 lg:px-32 2xl:px-64 z-20 shadow-lg">
        <a href="/">
          <div className="flex gap-5 items-center">
            <LogoSvg size={36} className="fill-white" />
            <h1 className={`text-3xl font-semibold text-white`}>Quizinho</h1>
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

      <div className="flex flex-col items-center justify-between gap-5 px-4 sm:px-12 lg:flex-row lg:px-32 2xl:px-64">
        <div className="w-full lg:w-[35%] flex flex-col gap-10 justify-center text-pretty">
          <div className="flex flex-col gap-2">
            <h2 className="text-5xl font-semibold">Descubra se seu amor te conhece de <span className="inline-block bg-primary text-primary-foreground w-fit rounded-md px-4 py-1">verdade!</span></h2>
            <p className="text-xl font-medium">Crie um quiz personalizado e divertido para o seu namorado(a) e compartilhe através de um QR code único!</p>
          </div>

          <Button variant={'ghost'} className="px-0 w-fit text-lg flex gap-2 hover:bg-transparent hover:text-primary transition-colors group hover:underline">
            Crie seu Quizinho
            <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
          </Button>
        </div>

        <div className="w-[75%] lg:w-[50%] max-h-max aspect-video border rounded-lg lg:rounded-2xl relative flex flex-col 
          after:absolute after:w-full after:h-full after:translate-x-1.5 after:translate-y-1.5 lg:after:translate-x-5 lg:after:translate-y-5
          after:rounded-lg lg:after:rounded-2xl after:bg-primary after:-z-10
        ">
          {/* fazer animaçãozinha da "sombra". Adicionar outra com a cor [#cfbaf0] mais deslocada */}

          <div className="w-2/4 h-2/4 absolute top-0 -translate-y-1/3 left-0 -translate-x-1/3 flex items-center overflow-hidden -z-20">
            <ul className="w-full aspect-square grid grid-cols-6 grid-rows-6 absolute scale-125 maskImage">
              {Array.from({ length: 36 }).map((_, index) => (
                <li key={index} className="border-b border-r border-primary"></li>
              ))}
            </ul>
          </div>

          <div className="w-1/3 h-1/3 absolute bottom-0 translate-y-1/2 right-0 translate-x-1/2 -z-20">
            <ul className="grid grid-cols-9 grid-rows-9 place-items-center w-full h-full maskImage2">
              {Array.from({ length: (9 * 9) }).map((_, index) => (
                <li key={index} className="size-1 bg-primary rounded-full"></li>
              ))}
            </ul>
          </div>

          <div className="w-full h-12 bg-neutral-900 rounded-t-lg lg:rounded-t-2xl flex justify-between items-center relative px-2.5 lg:px-5">
            <div className="size-5">
              <Image src="./quizinho-light-purple.svg" alt="quizinho logo" width={24} height={24} />
            </div>

            <ul className="flex gap-2 items-center h-full">
              <li className="size-2 bg-neutral-200 rounded-full"></li>
              <li className="size-2 bg-neutral-400 rounded-full"></li>
              <li className="size-2 bg-neutral-600 rounded-full"></li>
            </ul>
          </div>

          {/* <iframe src="https://quizinho.me/JArEt" className="w-full h-full rounded-b-2xl relative"></iframe> */}

          <div className="w-full h-full rounded-b-lg lg:rounded-b-2xl relative bg-white"></div>

        </div>
      </div>

      <Separator className="bg-muted-foreground" />

      <div className="flex w-full px-4 sm:px-12 lg:px-32 2xl:px-64">

        <div className="w-full overflow-hidden border rounded-lg lg:rounded-3xl p-5 flex flex-col-reverse lg:flex-row gap-5 bg-[#cfbaf0]">

          <div className="flex flex-col shrink-0 gap-5 w-full lg:w-[25%] text-black">
            <h4 className="text-2xl font-semibold text-center">Perguntas</h4>

            {questions && questions.length > 0 && (
              <ScrollArea className="h-full">
                <Accordion type="single" defaultValue={questions[questions.length - 1].question} collapsible
                  className="flex flex-col gap-5"
                >
                  {questions.map((question, index) => (
                    <AccordionItem value={question.question} key={index} className="relative group flex flex-col gap-2">

                      <AccordionTrigger className="text-xl text-start break-all">{question.question}</AccordionTrigger>

                      <AccordionContent>
                        <ul className="text-base flex flex-col gap-1">
                          {question.alternatives.map((alternative, index) => (
                            <li key={index} className="flex gap-2 items-center">
                              <Checkbox name={alternative.alternative} checked={alternative.correct} disabled={!alternative.correct} />
                              {alternative.alternative}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>

                      <Popover>
                        <PopoverTrigger className="aspect-square flex items-center justify-center rounded-md opacity-100 lg:opacity-100
                            group-hover:opacity-100 transition-opacity absolute top-0 right-0 cursor-pointer">
                          <EllipsisVertical className="text-muted-foreground" />
                        </PopoverTrigger>

                        <PopoverContent className="w-fit flex flex-col gap-3 border-muted-foreground">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant={'outline'} className="border-primary py-0 hover:bg-primary hover:border-transparent" onClick={() => handleEditStart(question)}>Editar</Button>
                            </DialogTrigger>

                            <DialogContent className="w-[80%] lg:w-fit rounded-md">
                              <DialogHeader>
                                <DialogTitle>Editar Pergunta</DialogTitle>
                                <DialogDescription>Tem certeza que deseja atualizar a pergunta?</DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                                <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 items-center gap-4">
                                  <Label htmlFor="pergunta" className="text-start lg:text-right text-nowrap">Pergunta</Label>
                                  <Input
                                    className="col-span-3 h-full min-h-10 border-muted-foreground focus-visible:ring-primary focus-visible:border-none"
                                    value={editingQuestion?.question}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      if (editingQuestion) {
                                        setEditingQuestion({
                                          ...editingQuestion,
                                          question: e.currentTarget.value
                                        });
                                      }
                                    }}
                                  />
                                </div>

                                {editingQuestion?.alternatives.map((alternative, index) => (
                                  <div key={index} className="grid grid-rows-2 grid-cols-3 lg:grid-rows-1 lg:grid-cols-4 items-center gap-1 lg:gap-4">
                                    <Label htmlFor={alternative.alternative} className="text-start lg:text-right text-nowrap col-span-3 lg:col-span-1 py-0 space-y-0">Alternativa {index + 1}</Label>
                                    <Input id={alternative.alternative}
                                      value={alternative.alternative}
                                      className="col-span-2 h-full border-muted-foreground focus-visible:border-none focus-visible:ring-primary"
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const updatedAlternatives = editingQuestion?.alternatives.map(a => {
                                          if (a.alternative === alternative.alternative) {
                                            return {
                                              ...a,
                                              alternative: e.currentTarget.value
                                            };
                                          }
                                          return a;
                                        });

                                        if (editingQuestion) {
                                          setEditingQuestion({
                                            ...editingQuestion,
                                            alternatives: updatedAlternatives
                                          });
                                        }
                                      }}
                                    />

                                    <div className="w-full h-full flex gap-1 lg:gap-2 items-center justify-between">
                                      <Checkbox
                                        className="w-1/2 h-full border-muted-foreground focus-visible:ring-primary focus-visible:border-none data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none"
                                        checked={alternative.correct}
                                        onCheckedChange={e => {
                                          const updatedAlternatives = editingQuestion?.alternatives.map(a => {
                                            if (a.alternative === alternative.alternative) {
                                              return {
                                                ...a,
                                                correct: e === true // Atualiza o valor do checkbox para verdadeiro ou falso
                                              };
                                            }
                                            return a;
                                          });

                                          if (editingQuestion) {
                                            setEditingQuestion({
                                              ...editingQuestion,
                                              alternatives: updatedAlternatives
                                            });
                                          }
                                        }}
                                      />

                                      <Button
                                        className="border-muted-foreground p-0 size-9 bg-red-500 lg:hover:bg-red-500 hover:border-transparent flex items-center justify-center rounded-md cursor-pointer focus-visible:bg-red-500"
                                        onClick={() => {
                                          const updatedAlternatives = editingQuestion?.alternatives.filter((_, i) => i !== index);
                                          if (editingQuestion) {
                                            setEditingQuestion({
                                              ...editingQuestion,
                                              alternatives: updatedAlternatives
                                            });
                                          }
                                        }}
                                      >
                                        <Trash2 />
                                      </Button>
                                    </div>
                                  </div>
                                ))}

                                <div className="w-full grid grid-cols-4">
                                  <Button variant={"outline"} className="border-muted-foreground hover:bg-primary hover:border-none focus-visible:ring-primary focus-visible:border-none hover:text-white focus-visible:bg-primary focus-visible:text-white col-span-4 lg:col-start-2 lg:col-span-3"
                                    onClick={() => {
                                      const newAlternative = { alternative: '', correct: false };
                                      const updatedAlternatives = [...(editingQuestion?.alternatives || []), newAlternative];

                                      if (editingQuestion) {
                                        setEditingQuestion({
                                          ...editingQuestion,
                                          alternatives: updatedAlternatives
                                        });
                                      }
                                    }}
                                  >
                                    <Plus />
                                  </Button>
                                </div>
                              </div>

                              <DialogFooter className="flex flex-row justify-end gap-2">
                                <DialogClose className="focus-visible:ring-0 ">
                                  <Button
                                    className="focus-visible:ring-primary border border-muted-foreground focus-visible:border-none"
                                    variant={"secondary"}
                                    type="reset"
                                    onClick={handleEditCancel}
                                  >
                                    Cancel changes
                                  </Button>
                                </DialogClose>

                                <DialogClose>
                                  <Button
                                    className="focus-visible:ring-primary focus-visible:border-none"
                                    onClick={handleEditConfirm}
                                  >
                                    Save changes
                                  </Button>
                                </DialogClose>
                              </DialogFooter>

                            </DialogContent>
                          </Dialog>

                          <Button variant={'outline'} className="border-red-500 py-0 hover:bg-red-500 hover:border-transparent"
                            onClick={() => {
                              const updatedQuestions = questions?.filter((_, i) => i !== index);
                              setQuestions(updatedQuestions)
                            }}
                          >
                            Deletar
                          </Button>
                        </PopoverContent>
                      </Popover>

                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            )}

            {/* Mexer dps para o mobile */}
            {questions.length >= 2 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Criar Quizinho</Button>
                </DialogTrigger>

                <DialogContent className="h-fit w-[80%] lg:w-fit rounded-md transition-all">
                  {/* {!loading && !qrCodeURL && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-xl">Pronto para criar o seu Quizinho?</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-base text-justify text-pretty lg:text-left">
                          Depois de criar, seu Quizinho estará pronto para ser compartilhado!
                          Lembre-se, ele não poderá ser editado e ficará disponível por um tempo limitado.
                          Tem certeza que deseja continuar?
                        </DialogDescription>
                      </DialogHeader>


                      <DialogFooter className="flex flex-row justify-end gap-5 w-full">
                        <DialogClose asChild>
                          <Button variant={"destructive"} className="w-fit">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleCreateQuizinho} className="w-fit">Criar</Button>
                      </DialogFooter>
                    </>
                  )} */}

                  {/* {loading && !qrCodeURL && (
                    <div className="w-full flex flex-col gap-5">

                      <DialogHeader>
                        <DialogTitle className="text-xl">Seu Quizinho está quase pronto!</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-base text-pretty text-justify lg:text-left">Estamos gerando o seu Quizinho cheio de amor e diversão.
                          Isso vai levar só um instante.
                          Segure a ansiedade, ele já já estará pronto para ser compartilhado!</DialogDescription>
                      </DialogHeader>

                      <Loader className={"self-center"} />
                    </div>
                  )} */}

                  {/* {!loading && qrCodeURL && ( */}
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-lg">Seu Quizinho está pronto!</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-base text-justify text-pretty lg:text-left">
                        Agora é só compartilhar com quem você ama!
                        Use o QR code abaixo para enviar seu Quizinho e descobrir o quanto ele(a) te conhece.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="w-full h-fit flex flex-col items-center gap-5 justify-center">
                      <div className="w-fit h-fit bg-foreground rounded-lg">
                        <qr-code
                          contents={'qrCodeURL'}
                          module-color="#3dccc7"
                          position-ring-color="#cfbaf0"
                          position-center-color="#3dccc7"
                          mask-x-to-y-ratio="1.2"
                        >
                          <Image alt="" src="./quizinho-light-purple.svg" slot="icon" />
                        </qr-code>
                      </div>

                      {/* <QRCodeSVG
                          value={'te amo mto momo'}
                          // title={"Title for my QR Code"}
                          size={256}
                          bgColor={"transparent"}
                          fgColor={"white"}
                          level={"L"}
                          marginSize={0}
                          imageSettings={{
                            src: "./quizinho-light-purple.svg",
                            x: undefined,
                            y: undefined,
                            height: 50,
                            width: 50,
                            opacity: 1,
                            excavate: true,
                          }}
                        /> */}

                      {/* <a href={qrCodeURL} target="_black">
                        <span>{qrCodeURL}</span>
                      </a> */}

                      <Button onClick={handleShare}>Compartilhar</Button>

                      <div className="flex gap-2">
                        <WhatsappShareButton windowPosition="windowCenter" title="Quizinho - Crie um quiz para seu amorzinho" separator="" url={'https://trembalajobs.com/elojob'}>
                          <WhatsappIcon round size={32} />
                        </WhatsappShareButton>

                        {/* <TwitterShareButton title="Quizinho - Crie um quiz para seu amorzinho" url={qrCodeURL}>
                          <XIcon round size={32} />
                        </TwitterShareButton>

                        <FacebookShareButton title="Quizinho - Crie um quiz para seu amorzinho" url={qrCodeURL}>
                          <FacebookIcon round size={32} />
                        </FacebookShareButton>

                        <TelegramShareButton title="Quizinho - Crie um quiz para seu amorzinho" url={qrCodeURL}>
                          <TelegramIcon round size={32} />
                        </TelegramShareButton>

                        <LinkedinShareButton title="Quizinho - Crie um quiz para seu amorzinho" url={qrCodeURL}>
                          <LinkedinIcon round size={32} />
                        </LinkedinShareButton> */}
                      </div>

                    </div>
                  </>
                  {/* )} */}

                </DialogContent>
              </Dialog>
            )}
          </div>


          {/* Aparentemente pronto para o mobile */}
          <div className="w-full max-h-max rounded-xl flex items-center justify-center bg-background relative lg:aspect-video">
            <div className="flex flex-col py-10 gap-2 lg:py-0  lg:gap-5 items-center w-full">
              <h4 className="text-lg lg:text-3xl font-medium">Crie sua {questions.length === 0 && (<>primeira</>)} pergunta...</h4>

              <div className="flex items-center px-2 py-1 border border-muted-foreground rounded-full w-[75%] lg:w-[35%] focus-within:w-[80%] lg:focus-within:w-[40%] focus-within:border-primary transition-all">
                <Input type="text" className="border-none focus-visible:ring-0 text-lg"
                  value={question}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const hasValue = e.currentTarget.value.length > 0;
                    if (hasValue !== inputHasValue) {
                      setInputHasValue(hasValue);
                    }
                    setQuestion(e.currentTarget.value)
                  }} />
                <ArrowRightCircle size={32} className="text-muted-foreground hidden lg:inline-block" />
              </div>

              <div className="flex flex-col items-center gap-2 text-center w-fit">
                {inputHasValue && (
                  <>
                    <div className="w-full h-8 flex justify-between items-center">
                      <span className="font-medium text-base">Alternativas</span>

                      <span className="font-medium text-base">Correta</span>
                    </div>

                    <ul className="w-full flex flex-col gap-2">
                      {Array.from({ length: questionsAmount }).map((_, index) => (
                        <li key={index} className="flex gap-2 lg:gap-5 items-center w-full">
                          <Input type="text"
                            className="focus-visible:ring-primary focus-visible:border-none border-muted-foreground"
                            placeholder="Sua alternativa"
                            value={alternatives[index] || ''}
                            onChange={(e: { target: { value: string; }; }) => {
                              const newAlternatives = [...alternatives];
                              newAlternatives[index] = e.target.value;
                              setAlternatives(newAlternatives);
                            }}
                          />

                          <Checkbox className="border-muted-foreground size-9 justify-self-center focus-visible:ring-primary focus-visible:border-none data-[state=checked]:border-none data-[state=checked]:bg-emerald-500"
                            checked={checkboxes[index]}
                            onCheckedChange={(e: boolean) => {
                              const newCheckboxes = [...checkboxes]
                              newCheckboxes[index] = Boolean(e)
                              setCheckboxes(newCheckboxes)
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <Button className="w-[90%] lg:w-[25%] lg:hover:w-[30%] rounded-md focus-visible:ring-muted-foreground lg:focus-visible:w-[30%] transition-all"
                onClick={handleQuestionCreate}
              >
                Criar Pergunta
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* {!loading && qrCodeURL && (
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
          numberOfPieces={50}
          confettiSource={{
            w: 10,
            h: 10,
            x: width / 2,
            y: height / 2,
          }}
        />
      )} */}

      <div className="w-full h-36 flex justify-center items-center px-4 sm:px-12 lg:px-32">
        <span>© Quizinho {format(new Date, 'yyyy')}</span>
      </div>
    </main>
  )
}