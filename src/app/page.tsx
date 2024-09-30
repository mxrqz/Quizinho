"use client"

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowRightCircle, Check, CircleUserRound, Crown, EllipsisVertical, MoonStar, Plus, Sun, Trash2, X } from "lucide-react";

import LogoSvg from "@/components/svg";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loading";
import axios from 'axios';
import { toPng } from 'html-to-image';
import * as qr from '@bitjson/qr-code';
import useWindowSize from 'react-use/lib/useWindowSize';
import SizedConfetti from 'react-confetti';
import { format } from 'date-fns';
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

interface Questions {
  question: string,
  alternatives: string[],
  correctAlternative: string
}

const questionsAmount = 4

// const serverURL = 'https://api.quizinho.me'
const serverURL = 'http://localhost:3001'
const quizinhoURL = 'quizinho.me/'

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [inputHasValue, setInputHasValue] = useState<boolean>(false)
  const [questions, setQuestions] = useState<Questions[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Questions | null>(null);
  const [originalQuestion, setOriginalQuestion] = useState<Questions | null>(null);
  const [question, setQuestion] = useState<string>('')
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [correctAlternative, setCorrectAlternative] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | undefined>(undefined)
  const [customURL, setCustomURL] = useState<string>('')

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getLoading = searchParams.get('loading') || 'false'
  const loading = getLoading === "true" ? true : false
  const qrCodeURL = searchParams.get('qrCodeURL') || ''
  const getModal = searchParams.get('modal') || 'false'
  const modalOpen = getModal === 'true' ? true : false

  const setMode = (mode: "light" | "dark") => {
    localStorage.theme = mode

    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    setDarkMode(!darkMode)
  }

  const handleQuestionCreate = () => {
    if (!question || !alternatives) return
    const prevQuestions = [...questions]

    const newQuestion = {
      question,
      alternatives,
      correctAlternative
    }

    setQuestions([...prevQuestions, newQuestion])
    setQuestion('');
    setAlternatives([]);
    setCorrectAlternative('')
    // setCheckboxes([])
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

  const handleCreateQuizinho = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loading = router.push(pathname + '?' + createQueryString('loading', 'true'), { scroll: false })

    const quizinhoData = selectedPlan === "premium" ? { questions: questions, customURL: customURL } : { questions }

    const data = await (await axios.post(`${serverURL}/create-quizinho`, quizinhoData)).data

    if (data.url) {
      window.location.href = data.url
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const qrCodeURL = router.push(pathname + '?' + createQueryString('qrCodeURL', data) + '&' + createQueryString('loading', 'false'), { scroll: false })
    }
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const { width, height } = useWindowSize()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      }
    }
  }

  const item1 = {
    hidden: {
      opacity: 0,
      x: 0,
      y: 0,
    },
    show: {
      opacity: 1,
      x: "1.25rem",
      y: "1.25rem",
    }
  }

  const item2 = {
    hidden: {
      opacity: 0,
      x: "1.25rem",
      y: "1.25rem"
    },
    show: {
      opacity: 1,
      x: "2.5rem",
      y: "2.5rem",
    }
  }

  useEffect(() => {
    const qrCodeToPNG = async () => {
      const qrCodeElement = document.querySelector('qr-code');
      if (!qrCodeElement) return;
      const shadowRoot = qrCodeElement.shadowRoot;
      let svgElement
      if (shadowRoot) {
        svgElement = shadowRoot.querySelector('svg');
      };
      const imgElement = qrCodeElement.querySelector('img')
      if (!imgElement || !svgElement) return;

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';

      document.body.appendChild(wrapper);

      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      clonedSvg.style.position = 'relative';

      wrapper.appendChild(clonedSvg);

      const clonedImg = imgElement.cloneNode(true) as HTMLImageElement;
      clonedImg.style.position = 'absolute';
      clonedImg.style.left = '50%';
      clonedImg.style.top = '50%';
      clonedImg.style.width = '60px';
      clonedImg.style.height = '60px';
      clonedImg.style.transform = 'translate(-50%, -50%)';
      wrapper.appendChild(clonedImg);

      try {
        const pngDataUrl = await toPng(wrapper, { quality: 1 });

        await axios.post(`${serverURL}/qr-code`, { pngDataUrl, qrCodeURL })
      } catch (error) {
        console.error('Erro ao converter QR Code para PNG:', error);
      }
    }

    const qrCodeElement = document.querySelector('qr-code');
    if (qrCodeElement) {
      qrCodeElement.addEventListener('codeRendered', () => {
        qrCodeToPNG()
      });
    }

    return () => {
      if (qrCodeElement) {
        qrCodeElement.removeEventListener('codeRendered', console.log);
      }
    };
  }, [qrCodeURL, loading]);

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

  return (
    <main className="flex flex-col gap-16 lg:gap-24 max-w-full h-full overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full invert dark:invert-0">
        <ShootingStars />
        <StarsBackground starDensity={0.00025} allStarsTwinkle={false} twinkleProbability={0.4} />
      </div>

      <nav className="flex justify-between items-center lg:items-end sticky left-0 w-full h-12 lg:h-24 top-0 pt-12 lg:pt-0 py-2 px-4 sm:px-12 lg:px-32 2xl:px-64 transition-all backdrop-blur-sm z-10">
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

      <div className="relative flex flex-col items-center justify-between gap-16 lg:gap-5 px-4 sm:px-12 lg:flex-row lg:px-32 2xl:px-64">
        <div className="w-full lg:w-[35%] flex flex-col gap-10 items-center lg:items-start justify-center text-pretty">

          <div className="absolute -top-10 left-0 lg:left-36 w-fit flex items-center blur-2xl opacity-100 dark:opacity-10 rotate-180">
            <img src="./blob_gradient.png" alt="blob" />
          </div>

          <div className="relative flex flex-col gap-2 text-center lg:text-start">
            <h2 className="text-3xl lg:text-5xl font-semibold">Descubra se seu amor te conhece de <span className="inline-block bg-primary text-primary-foreground w-fit rounded-md px-4 py-1">verdade!</span></h2>
            <p className="text-lg lg:text-xl font-medium text-pretty">Crie um quiz personalizado e divertido para o seu namorado(a) e compartilhe através de um QR code único!</p>
          </div>

          <a href="#quizinho">
            <Button variant={'ghost'} className="relative px-0 w-fit text-lg flex gap-2 hover:bg-transparent hover:text-primary transition-colors group hover:underline">
              Crie seu Quizinho
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </a>
        </div>

        <div className="w-full lg:w-[50%] max-h-max aspect-video border rounded-lg lg:rounded-2xl relative flex flex-col">

          <div className="absolute w-full h-full top-0 left-0">
            <motion.div className="hidden absolute lg:inline-block top-0 left-0 w-full h-full"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div className="absolute w-full h-full bg-primary -z-10 rounded-lg lg:rounded-2xl"
                variants={item1}>
              </motion.div>

              <motion.div className="absolute w-full h-full bg-violet-500 -z-20 rounded-lg lg:rounded-2xl"
                variants={item2}>
              </motion.div>
            </motion.div>

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
          </div>

          <div className="w-full h-12 bg-neutral-900 rounded-t-lg lg:rounded-t-2xl flex justify-between items-center relative px-2.5 lg:px-5">

            <div className="size-5">
              <img src="./quizinho-light-purple.svg" alt="quizinho logo" />
            </div>

            <ul className="flex gap-2 items-center h-full">
              <li className="size-2 bg-neutral-200 rounded-full"></li>
              <li className="size-2 bg-neutral-400 rounded-full"></li>
              <li className="size-2 bg-neutral-600 rounded-full"></li>
            </ul>
          </div>

          <div className="w-full h-full rounded-b-lg lg:rounded-b-2xl relative bg-white"></div>

        </div>
      </div>

      <Separator className="bg-muted-foreground hidden lg:inline-block" />

      <div id="quizinho" className="relative flex w-full px-4 sm:px-12 lg:px-32 2xl:px-64">
        <div className="w-full overflow-hidden border rounded-lg lg:rounded-3xl p-5 flex flex-col-reverse lg:flex-row gap-5 bg-violet-500">

          <div className="flex flex-col shrink-0 gap-5 w-full lg:w-[25%] text-white">
            <h4 className="text-2xl font-semibold text-center">Perguntas</h4>

            <ScrollArea className="h-full">
              {questions && questions.length > 0 && (
                <Accordion type="single" defaultValue={questions[questions.length - 1].question} collapsible className="flex flex-col gap-5">
                  {questions.map((question, index) => (
                    <AccordionItem value={question.question} key={index} className="relative group flex flex-col gap-2">

                      <AccordionTrigger className="text-xl text-start break-all">{question.question}</AccordionTrigger>

                      <AccordionContent>
                        <ul className="text-base flex flex-col gap-1">
                          {question.alternatives.map((alternative, index) => (
                            <li key={index} className="flex gap-2 items-center">
                              <Checkbox name={alternative} checked={alternative === question.correctAlternative} disabled={alternative !== question.correctAlternative} />
                              {alternative}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>

                      <Popover>
                        <PopoverTrigger className="aspect-square flex items-center justify-center rounded-md opacity-100 lg:opacity-100
                            group-hover:opacity-100 transition-opacity absolute top-5 right-0 cursor-pointer">
                          <EllipsisVertical className="text-white" />
                        </PopoverTrigger>

                        <PopoverContent className="w-fit flex flex-col gap-3 border-muted-foreground">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant={'outline'} className="border-primary py-0 hover:bg-primary hover:border-transparent" onClick={() => handleEditStart(question)}>Editar</Button>
                            </DialogTrigger>

                            <DialogContent className="w-fit flex flex-col">
                              <DialogHeader>
                                <DialogTitle>Editar Pergunta</DialogTitle>
                                <DialogDescription>Tem certeza que deseja atualizar a pergunta?</DialogDescription>
                              </DialogHeader>

                              <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col items-start gap-2">
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                                  {editingQuestion?.alternatives.map((alternative, index) => (
                                    <div key={index} className="flex flex-col items-start gap-2">
                                      <Label htmlFor={alternative} className="text-start lg:text-right text-nowrap py-0 space-y-0">Alternativa {index + 1}</Label>

                                      <div className="flex w-full gap-2">
                                        <Input id={alternative}
                                          value={alternative || ''}
                                          className="h-9 border-muted-foreground focus-visible:border-none focus-visible:ring-primary"
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const updatedAlternatives = editingQuestion?.alternatives.map(a => {
                                              if (a === alternative) {
                                                return e.currentTarget.value
                                              }
                                              return a
                                            });

                                            if (editingQuestion) {
                                              setEditingQuestion({
                                                ...editingQuestion,
                                                alternatives: updatedAlternatives
                                              });
                                            }
                                          }}
                                        />

                                        <Button className="border-muted-foreground p-0 size-9 aspect-square bg-red-500 lg:hover:bg-red-500 hover:border-transparent flex items-center justify-center rounded-md cursor-pointer focus-visible:bg-red-500"
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
                                </div>

                                {editingQuestion?.alternatives && editingQuestion?.alternatives.length < 4 && (
                                  <Button variant={"outline"} className="border-muted-foreground hover:bg-primary hover:border-none focus-visible:ring-primary focus-visible:border-none hover:text-white focus-visible:bg-primary focus-visible:text-white col-span-4 lg:col-start-2 lg:col-span-3"
                                    onClick={() => {
                                      const newAlternative = '';
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
                                )}

                                <div>
                                  <Label htmlFor='Seleciona a alternativa Correta' className="text-start lg:text-right text-nowrap py-0 space-y-0">Selecione a alternativa correta</Label>

                                  <Select value={editingQuestion?.correctAlternative || ''}
                                    onValueChange={(alternative) => {
                                      setEditingQuestion(prevQ => {
                                        if (prevQ) {
                                          return {
                                            ...prevQ,
                                            correctAlternative: alternative,
                                          };
                                        }
                                        return prevQ;
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="focus-visible:ring-primary focus-visible:border-none border-muted-foreground">
                                      <SelectValue placeholder="Selecione a alternativa correta" />
                                    </SelectTrigger>

                                    <SelectContent>
                                      {editingQuestion?.alternatives.map((alt, index) => (
                                        alt.length > 0 ? <SelectItem key={index} value={alt || ''}>{alt || ''}</SelectItem> : ''
                                      ))}
                                    </SelectContent>
                                  </Select>
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
              )}
            </ScrollArea>

            <Dialog defaultOpen={modalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-foreground text-background"
                  disabled={questions.length < 2}
                  onClick={() => router.push(pathname + '?' + createQueryString('modalOpen', 'true'), { scroll: false })}
                >
                  Criar Quizinho
                </Button>
              </DialogTrigger>

              <DialogContent className="h-fit w-[80%] lg:w-fit rounded-md transition-all">
                {!loading && !qrCodeURL && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-xl">Pronto para criar o seu Quizinho?</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-base text-justify text-pretty lg:text-left">
                        Escolha uma das opções abaixo para continuar:
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid lg:grid-cols-2 gap-2">
                      <div className={`rounded-lg p-5 flex flex-col gap-3 cursor-pointer overflow-hidden border relative ${selectedPlan === "free" && "bg-foreground/10 border-white"}`}
                        onClick={() => setSelectedPlan("free")}
                      >
                        <div className="absolute w-full h-full bg-foreground/30 top-0 left-0 noise opacity-30"></div>

                        <div className="w-full flex flex-col gap-2 py-2 relative z-10">
                          <div className="flex gap-2">
                            <CircleUserRound />
                            <span className="font-semibold text-foreground">Grátis</span>
                          </div>

                          <span className="text-xl font-semibold text-foreground">R$0</span>
                        </div>

                        <Button className="bg-violet-500 hover:bg-violet-400 relative z-10">Selecionar</Button>

                        <ul className="flex flex-col gap-1 relative z-10">
                          <li className="flex flex-nowrap gap-2">
                            <X className="text-red-500" />
                            Todas funcionalidades
                          </li>

                          <li className="flex flex-nowrap gap-2">
                            <X className="text-red-500" />
                            URL personalizada
                          </li>

                          <li className="flex flex-nowrap gap-2">
                            <X className="text-red-500" />
                            Página sem Anúncios
                          </li>

                          <li className="flex flex-nowrap gap-2">
                            <Check className="text-green-500" />
                            Disponível por 1 semana
                          </li>
                        </ul>
                      </div>

                      <div className={`rounded-lg p-5 flex flex-col gap-3 cursor-pointer overflow-hidden border relative ${selectedPlan === "premium" && "bg-foreground/10 border-white"}`}
                        onClick={() => setSelectedPlan("premium")}
                      >
                        <div className="absolute w-full h-full bg-foreground/30 top-0 left-0 noise opacity-30"></div>

                        <div className="w-full flex flex-col gap-2 py-2 relative z-10">
                          <div className="flex gap-2">
                            <Crown className="text-yellow-500" />
                            <span className="font-semibold text-foreground">Premium</span>
                          </div>

                          <span className="text-xl font-semibold text-foreground">R$5</span>
                        </div>

                        <Button className="bg-violet-500 hover:bg-violet-400 relative z-10">Selecionar</Button>

                        <ul className="flex flex-col gap-1 relative z-10">
                          <li className="flex flex-nowrap gap-2">
                            <Check className="text-green-500" />
                            Todas funcionalidades
                          </li>

                          <li className="flex flex-nowrap gap-2">
                            <Check className="text-green-500" />
                            URL personalizada
                          </li>

                          <li className="flex flex-nowrap gap-2">
                            <Check className="text-green-500" />
                            Página sem Anúncios
                          </li>

                          <li className="flex flex-nowrap gap-2">
                            <Check className="text-green-500" />
                            Disponível por 6 mês
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customUrl">Defina sua URL personalizada (Não use emojis ou caracteres especiais)</Label>

                      <div className="border flex items-center px-2 gap-1 text-foreground/70 font-medium text-base rounded-md focus-within:border-violet-500">
                        <span>{quizinhoURL}</span>
                        <Input id="customUrl"
                          className="border-none ring-0 focus-visible:ring-0 px-0 text-foreground font-medium text-base"
                          disabled={selectedPlan !== 'premium'}
                          value={customURL || ''}
                          onChange={(e) => {
                            const sanitizedURL = e.currentTarget.value
                              .replace(/\s+/g, '_')
                              .replace(/[^a-zA-Z0-9-_]/g, '');
                            setCustomURL(sanitizedURL);
                          }}
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex flex-row justify-end gap-5 w-full">
                      <DialogClose asChild>
                        <Button variant={"outline"} className="w-fit">Cancelar</Button>
                      </DialogClose>
                      <Button onClick={handleCreateQuizinho} className="w-fit bg-violet-500 hover:bg-violet-400"
                        disabled={!selectedPlan}
                      >
                        Criar
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {loading && !qrCodeURL && (
                  <div className="w-full flex flex-col gap-5">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Seu Quizinho está quase pronto!</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-base text-pretty text-justify lg:text-left">
                        Estamos gerando o seu Quizinho!</DialogDescription>
                    </DialogHeader>

                    <Loader className={"self-center"} />
                  </div>
                )}

                {!loading && qrCodeURL && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-lg">Seu Quizinho está pronto!</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-base text-justify text-pretty lg:text-left">
                        Agora é só compartilhar com quem você ama!
                        Use o QR code abaixo para enviar seu Quizinho e descobrir o quanto ele(a) te conhece.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="w-full h-fit flex flex-col items-center gap-5 justify-center">
                      <div className="size-88 bg-foreground rounded-lg overflow-hidden">
                        <div className="translate-x-1 scale-110 ">
                          <qr-code
                            contents={qrCodeURL}
                            squares
                          />
                        </div>
                      </div>

                      <a href={qrCodeURL} target="_black">
                        <span>{qrCodeURL}</span>
                      </a>

                      <div className="flex gap-2">
                        <WhatsappShareButton windowPosition="windowCenter" title="Quizinho - Crie um quiz para seu amorzinho" separator="" url={'https://trembalajobs.com/elojob'}>
                          <WhatsappIcon round size={32} />
                        </WhatsappShareButton>

                        <TwitterShareButton title="Quizinho - Crie um quiz para seu amorzinho" url={qrCodeURL}>
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
                        </LinkedinShareButton>
                      </div>

                    </div>
                  </>
                )}

              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full max-h-max rounded-xl flex items-center justify-center bg-background relative lg:aspect-video">
            <div className="flex flex-col py-10 gap-2 lg:py-0  lg:gap-5 items-center w-full">
              <h4 className="text-lg lg:text-3xl font-medium">Crie sua {questions.length === 0 && (<>primeira</>)} pergunta...</h4>

              <div className="flex items-center px-2 py-1 border border-muted-foreground rounded-full w-[75%] lg:w-[55%] focus-within:w-[80%] lg:focus-within:w-[60%] focus-within:border-primary transition-all">
                <Input type="text" className="border-none focus-visible:ring-0 text-lg"
                  placeholder="Sua pergunta"
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

              <div className="flex flex-col items-start gap-5 text-center w-[75%] lg:w-[55%]">
                {inputHasValue && (
                  <>
                    <ul className="w-full grid grid-cols-2 gap-2">
                      {Array.from({ length: questionsAmount }).map((_, index) => (
                        <li key={index} className="flex flex-col items-start w-full">
                          <Label htmlFor={alternatives[index] || ''} className="cursor-pointer font-medium text-sm">{`Alternativa ${index + 1}`}</Label>
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
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col w-full items-start">
                      <Label htmlFor='Seleciona a alternativa Correta' className="cursor-pointer font-medium text-sm">Selecione a alternativa correta</Label>

                      <Select value={correctAlternative} onValueChange={(alternative) => setCorrectAlternative(alternative)}>
                        <SelectTrigger className="focus-visible:ring-primary focus-visible:border-none border-muted-foreground">
                          <SelectValue placeholder="Selecione a alternativa correta" />
                        </SelectTrigger>

                        <SelectContent>
                          {alternatives.map((alt, index) => (
                            <SelectItem key={index} value={alt}>{alt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </div>
                  </>
                )}
              </div>

              <Button className="w-[90%] lg:w-[25%] lg:hover:w-[30%] rounded-md focus-visible:ring-muted-foreground lg:focus-visible:w-[30%] transition-all"
                onClick={handleQuestionCreate} disabled={!question || alternatives.length < 2 || !correctAlternative ? true : false}
              >
                Criar Pergunta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!loading && qrCodeURL && (
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
      )}

      <div className="relative w-full h-36 flex justify-center items-center px-4 sm:px-12 lg:px-32">
        <span>© Quizinho {format(new Date, 'yyyy')}</span>
      </div>
    </main>
  )
}