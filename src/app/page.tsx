"use client"

import { MouseEvent, useCallback, useEffect, useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowRightCircle, Check, CircleUserRound, Crown, Edit2, EllipsisVertical, Eye, MessageCircle, MoonStar, Plus, Sun, Trash2, X, Clipboard, Square, Ban, CheckCircle, Copy, Zap } from "lucide-react";
import LogoSvg from "@/components/svg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loading";
import axios from 'axios';
import * as qr from '@bitjson/qr-code';
import useWindowSize from 'react-use/lib/useWindowSize';
import SizedConfetti from 'react-confetti';
import { format } from 'date-fns';
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { SearchParamsWrapper } from "@/components/HomeContent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import visual components directly
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { toast } from "sonner";
// Import quiz example component directly
import QuizinhoExample from "./quizinhoExample";
import { Themes } from "./Themes";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { QuizQuestion, QuizPlan, QuizCreationData, QuizFormState, isValidQuizQuestion } from '@/types/quiz';

const questionsAmount = 4

// Using internal Next.js API routes instead of external server
const serverURL = ''
const quizinhoURL = 'quizinho.me/'

export default function Home() {
  // Simplified without A/B testing

  // Simplified without accessibility hooks

  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [inputHasValue, setInputHasValue] = useState<boolean>(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [originalQuestion, setOriginalQuestion] = useState<QuizQuestion | null>(null);
  const [question, setQuestion] = useState<string>('')
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [correctAlternative, setCorrectAlternative] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<QuizPlan | null>(null)
  const [customURL, setCustomURL] = useState<string>('')
  const [invalidURLS, setInvalidURLS] = useState<string[]>([])
  const [themesOpen, setThemesOpen] = useState<boolean>(false)
  const [selectedTheme, setSelectedTheme] = useState<string>('default')
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false)
  const [themeDarkMode, setThemeDarkMode] = useState<boolean>(true)

  const router = useRouter()
  const pathname = usePathname()

  const { width, height } = useWindowSize()

  // Simplified constants
  const ctaText = "Criar Meu Quiz Grátis";
  const ctaClasses = "relative font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white";
  const premiumPrice = "R$ 5,00";

  const getInvalidURLS = useCallback(async () => {
    try {
      const response = await axios.get('/api/invalid-urls');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch invalid URLs, using fallback list:', error);
      // Fallback list of common invalid URLs
      return ['admin', 'api', 'www', 'ftp', 'mail', 'test', 'dev', 'localhost', 'root', 'user'];
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

  const handleQuestionCreate = () => {
    try {
      // Validações
      if (!question.trim()) {
        toast.error('Digite uma pergunta válida.');
        return;
      }

      const validAlternatives = alternatives.filter(alt => alt.trim().length > 0);
      if (validAlternatives.length < 2) {
        toast.error('Adicione pelo menos 2 alternativas.');
        return;
      }

      if (!correctAlternative) {
        toast.error('Selecione a resposta correta.');
        return;
      }

      if (!validAlternatives.includes(correctAlternative)) {
        toast.error('A resposta correta deve estar entre as alternativas.');
        return;
      }

      const prevQuestions = [...questions];

      const newQuestion: Partial<QuizQuestion> = {
        question: question.trim(),
        alternatives: validAlternatives as QuizQuestion['alternatives'],
        correctAlternative
      };

      if (!isValidQuizQuestion(newQuestion)) {
        toast.error('Dados da pergunta inválidos. Verifique todos os campos.');
        return;
      }

      setQuestions([...prevQuestions, newQuestion]);
      setQuestion('');
      setAlternatives([]);
      setCorrectAlternative('');
      setInputHasValue(false);

      // Question creation successful
      const questionNumber = prevQuestions.length + 1;

      // Announce to screen readers

      toast.success('Pergunta adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      toast.error('Erro inesperado ao criar pergunta. Tente novamente.');
    }
  }

  const handleEditStart = (questionToEdit: QuizQuestion) => {
    setOriginalQuestion(questionToEdit);
    setEditingQuestion({ ...questionToEdit });
  };

  const handleEditConfirm = () => {
    if (!editingQuestion || !isValidQuizQuestion(editingQuestion)) {
      toast.error('Dados da pergunta inválidos.');
      return;
    }

    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.question === originalQuestion?.question ? editingQuestion : q
      )
    );
    setEditingQuestion(null);
    setOriginalQuestion(null);
    toast.success('Pergunta atualizada com sucesso!');
  };

  const handleEditCancel = () => {
    setEditingQuestion(null);
    setOriginalQuestion(null);
  };


  const createQueryString = useCallback(
    (name: string, value: string, searchParams: URLSearchParams) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    []
  )


  const Plans = () => {
    return (
      <>
        <Card className={`select-none w-full max-w-[350px] h-[400px] bg-gradient-to-br from-background to-muted/50 relative border border-muted-foreground hover:border-primary/50 ${selectedPlan === "free" && "border-violet-500 shadow-lg shadow-violet-500/30"} transition-all hover:shadow-lg`}
        >

          <CardHeader className="relative">
            <CardTitle className="flex gap-2 items-center">
              <CircleUserRound />
              Free
            </CardTitle>

            <CardDescription className="flex flex-col text-foreground/70">
              <span className="font-semibold text-xl">R$ 0</span>
              <span className="font-medium">Grátis para sempre</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <ul className="flex flex-col gap-1">
              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                Até 2 perguntas por quiz
              </li>

              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                QR Code para compartilhar
              </li>

              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                Tema padrão
              </li>

              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                Link básico de compartilhamento
              </li>

              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                Disponível por 7 dias
              </li>
            </ul>
          </CardContent>

          <CardFooter className="relative">
            <Button
              variant={"outline"}
              size="lg"
              className={`w-full h-12 border-none shadow-lg text-foreground bg-transparent hover:bg-transparent ${selectedPlan === "free" && 'shadow-violet-500'} transition-all touch-manipulation`}
              onClick={() => {
                setSelectedPlan("free");
              }}
            >
              {selectedPlan === 'free' ? 'Selecionado' : 'Selecionar'}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`select-none w-full max-w-[350px] h-[400px] bg-gradient-to-br from-primary/5 to-violet-500/10 relative border-2 border-primary/20 hover:border-primary/40 ${selectedPlan === "premium" && "border-violet-500 shadow-lg shadow-violet-500/30"} transition-all hover:shadow-xl`}
        >

          <CardHeader className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              ⭐ MAIS POPULAR
            </div>
            <CardTitle className="flex gap-2 items-center mt-2">
              <Crown className="text-yellow-500" />
              Premium
            </CardTitle>

            <CardDescription className="flex flex-col text-foreground/70">
              <span className="font-semibold text-xl">{premiumPrice}</span>
              <span className="font-medium">Por Quizinho</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <ul className="flex flex-col gap-1">
              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                Todas funcionalidades
              </li>

              <li className="flex flex-nowrap gap-2">
                <Check className="text-green-500" />
                Temas
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
                Disponível por 30 dias
              </li>
            </ul>
          </CardContent>

          <CardFooter className="relative">
            <Button
              variant={"outline"}
              size="lg"
              className={`w-full h-12 border-none shadow-lg text-foreground bg-transparent hover:bg-transparent ${selectedPlan === "premium" && 'shadow-violet-500'} transition-all touch-manipulation`}
              onClick={() => {
                setSelectedPlan("premium");
              }}
            >
              {selectedPlan === 'premium' ? 'Selecionado' : 'Selecionar'}
            </Button>
          </CardFooter>
        </Card>
      </>
    )
  }

  // useEffect(() => {
  //   const qrCodeToPNG = async () => {
  //     const qrCodeElement = document.querySelector('qr-code');
  //     if (!qrCodeElement) return;

  //     try {
  //       const pngDataUrl = await toPng(qrCodeElement, { quality: 1 });
  //       console.log(pngDataUrl)

  //       // await axios.post(`${serverURL}/qr-code`, { pngDataUrl, qrCodeURL })
  //     } catch (error) {
  //       console.error('Erro ao converter QR Code para PNG:', error);
  //     }
  //   }

  //   const qrCodeElement = document.querySelector('qr-code');
  //   if (qrCodeElement) {
  //     qrCodeElement.addEventListener('codeRendered', () => {
  //       qrCodeToPNG()
  //     });
  //   }

  //   return () => {
  //     if (qrCodeElement) {
  //       qrCodeElement.removeEventListener('codeRendered', qrCodeToPNG);
  //     }
  //   };
  // }, [qrCodeURL, loading]);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setDarkMode(false)
    }
  }, [])

  // Toggle analytics dashboard with keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAnalytics(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAnalytics]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      qr.defineCustomElements(window);
    }
  }, []);

  useEffect(() => {
    const fetchInvalidURLS = async () => {
      try {
        const invalid = await getInvalidURLS();
        setInvalidURLS(invalid);
      } catch (error) {
        console.error('Error fetching invalid URLs:', error);
        // Set a fallback list if everything fails
        setInvalidURLS(['admin', 'api', 'www', 'ftp', 'mail', 'test', 'dev', 'localhost', 'root', 'user']);
      }
    };

    fetchInvalidURLS();
  }, [getInvalidURLS]);

  // Preload components strategically after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      // Preload components that users are likely to interact with
      const preloadComponent = async (importFn: () => Promise<any>, name: string) => {
        try {
          await importFn();
          console.log(`✅ Preloaded component: ${name}`);
        } catch (error) {
          console.warn(`⚠️ Failed to preload component ${name}:`, error);
        }
      };

      // Preload components
      preloadComponent(() => import('react-share'), 'ReactShare');
      preloadComponent(() => import('@/components/ui/canvas-reveal-effect'), 'CanvasRevealEffect');
    }, 3000); // Preload after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Simplified without accessibility features

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        {(searchParams) => {
          const getLoading = searchParams.get('loading') || 'false'
          const loading = getLoading === "true" ? true : false
          const qrCodeURL = searchParams.get('qrCodeURL') || ''
          const getModal = searchParams.get('modal') || 'false'
          const modalOpen = getModal === 'true' ? true : false
          const id = searchParams.get('id') || ''

          const handleCreateQuizinho = async () => {
            try {
              // Validações antes de enviar
              if (!questions || questions.length < 2) {
                toast.error('Você precisa criar pelo menos 2 perguntas para seu quiz.');
                return;
              }

              if (!selectedPlan) {
                toast.error('Selecione um plano para continuar.');
                return;
              }

              if (selectedPlan === 'premium' && (!customURL || customURL.length < 5)) {
                toast.error('URL personalizada deve ter pelo menos 5 caracteres.');
                return;
              }

              // Validar todas as perguntas
              const invalidQuestions = questions.filter(q => !isValidQuizQuestion(q));
              if (invalidQuestions.length > 0) {
                toast.error('Existem perguntas inválidas. Verifique todos os dados.');
                return;
              }

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const loadingPush = router.push(pathname + '?' + createQueryString('loading', 'true', searchParams), { scroll: false });

              const quizinhoData: QuizCreationData = selectedPlan === "premium"
                ? { questions, customURL, plan: selectedPlan, theme: selectedTheme }
                : { questions, plan: selectedPlan, id: id || '' };

              const response = await axios.post('/api/create-quizinho', quizinhoData);
              const data = response.data;

              if (data.quizinho) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const qrCodeURLPush = router.push(pathname + '?' + createQueryString('qrCodeURL', data.quizinho, searchParams) + '&' + createQueryString('loading', 'false', searchParams), { scroll: false });
                toast.success('Quiz criado com sucesso! 🎉');

                // Quiz creation successful
              } else if (data.payment) {
                // Payment redirection
                window.location.href = data.payment;
              } else {
                throw new Error('Resposta inesperada do servidor');
              }
            } catch (error) {
              console.error('Erro ao criar quiz:', error);

              // Reset loading state
              router.push(pathname + '?' + createQueryString('loading', 'false', searchParams), { scroll: false });

              if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message;

                switch (status) {
                  case 400:
                    toast.error('Dados inválidos. Verifique suas perguntas e tente novamente.');
                    break;
                  case 409:
                    toast.error('Esta URL personalizada já está em uso. Escolha outra.');
                    break;
                  case 429:
                    toast.error('Muitas tentativas. Aguarde um momento e tente novamente.');
                    break;
                  case 500:
                    toast.error('Erro interno do servidor. Tente novamente em alguns minutos.');
                    break;
                  default:
                    toast.error(`Erro inesperado: ${message}`);
                }
              } else {
                toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
              }
            }
          }

          return (
            <main id="main-content" className="flex flex-col max-w-full h-full overflow-hidden relative" role="main" aria-label="Página principal do Quizinho">

      <div className="relative w-full h-full flex flex-col gap-16 pb-44">
        <div className="absolute top-0 left-0 w-full h-full invert dark:invert-0">
          <ShootingStars />
          <StarsBackground starDensity={0.00025} allStarsTwinkle={false} twinkleProbability={0.4} />
        </div>

        <header>
          <nav className="flex justify-between items-center lg:items-end sticky top-0 left-0 w-full h-12 lg:h-24 pt-12 lg:pt-0 py-2 px-4 sm:px-12 lg:px-32 2xl:px-64 transition-all backdrop-blur-sm z-10" role="navigation" aria-label="Navegação principal">
            <a href="/" aria-label="Página inicial do Quizinho">
              <div className="flex gap-5 items-center">
                <LogoSvg size={36} className="fill-foreground transition-all" />
                <h1 className="text-3xl font-semibold text-foreground transition-all">Quizinho</h1>
              </div>
            </a>

            <div>
              <button
                onClick={() => setMode(darkMode ? 'light' : 'dark')}
                aria-label={`Mudar para modo ${darkMode ? 'claro' : 'escuro'}`}
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                {darkMode ? (
                  <MoonStar className="text-foreground transition-all" />
                ) : (
                  <Sun className="text-foreground transition-all" />
                )}
              </button>
            </div>
          </nav>
        </header>

        <section
          className="relative flex flex-col items-center justify-between gap-16 lg:gap-8 xl:gap-12 px-4 sm:px-8 lg:flex-row lg:px-16 xl:px-32 2xl:px-64"
          aria-labelledby="hero-heading"
          role="banner"
        >
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-10 items-center lg:items-start justify-center text-pretty">

            <div className="absolute -top-10 left-0 lg:left-36 w-fit flex items-center blur-2xl opacity-100 dark:opacity-10 rotate-180">
              <Image src="/blob_gradient.png" alt="blob" width={500} height={500} priority className="max-w-none" />
            </div>

            <div className="relative flex flex-col gap-2 text-center lg:text-start">
              <h2 id="hero-heading" className="text-3xl lg:text-5xl font-semibold">Descubra se seu amor te conhece de <span className="inline-block bg-primary text-primary-foreground w-fit rounded-md px-4 py-1">verdade!</span></h2>
              <p className="text-lg lg:text-xl font-medium text-pretty">Crie um quiz personalizado e divertido para o seu namorado(a) e compartilhe através de um QR code único!</p>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-3">
              <a href="#quizinho" aria-label="Ir para seção de criação de quiz">
                <Button
                  size="lg"
                  className={ctaClasses}
                  onClick={() => {
                  }}
                  aria-describedby="cta-description"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 group-hover:translate-x-1.5 transition-transform" aria-hidden="true" />
                </Button>
              </a>
              <div id="cta-description" className="sr-only">
                Clique para ir para a seção onde você pode criar seu quiz personalizado
              </div>

              {/* Social Proof Real */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                </div>
                <span>✨ Centenas de casais já criaram seus quizzes</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[50%] xl:w-[55%] max-h-max aspect-video border rounded-2xl relative flex flex-col">

            <div className="absolute w-full h-full top-0 left-0">
              <motion.div className="hidden absolute lg:inline-block top-0 left-0 w-full h-full"
                initial={{
                  opacity: 1,
                  x: "0rem",
                  y: "0rem",
                }}
                animate={{
                  opacity: 1,
                  x: "1.25rem",
                  y: "1.25rem",
                  transition: {
                    repeat: Infinity,
                    repeatDelay: 4,
                    repeatType: "reverse",
                    delay: 0.5,
                  }
                }}
              >
                <motion.div className="absolute w-full h-full bg-primary -z-10 rounded-2xl"></motion.div>

                <motion.div className="absolute w-full h-full bg-violet-500 -z-20 rounded-2xl"
                  initial={{
                    opacity: 1,
                    x: "0rem",
                    y: "0rem",
                  }}
                  animate={{
                    opacity: 1,
                    x: "1.25rem",
                    y: "1.25rem",
                    transition: {
                      repeat: Infinity,
                      repeatDelay: 4,
                      repeatType: "reverse",
                    }
                  }}
                >
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

            <div className="w-full h-12 bg-neutral-900 rounded-t-2xl flex justify-between items-center relative px-2.5 lg:px-5">

              <div className="size-5">
                <Image src="/quizinho-light-purple.svg" alt="quizinho logo" width={20} height={20} />
              </div>

              <ul className="flex gap-2 items-center h-full">
                <li className="size-2 bg-neutral-200 rounded-full"></li>
                <li className="size-2 bg-neutral-400 rounded-full"></li>
                <li className="size-2 bg-neutral-600 rounded-full"></li>
              </ul>
            </div>

            <div className="w-full h-full rounded-b-2xl relative bg-white overflow-hidden">
              {/* Mockup Content - Preview de um Quiz */}
              <div className="p-4 h-full flex flex-col justify-center items-center space-y-4">
                <div className="w-full max-w-sm">
                  {/* QR Code Mockup */}
                  <div className="bg-black w-24 h-24 mx-auto mb-3 rounded grid grid-cols-8 grid-rows-8 gap-[1px] p-1">
                    {Array.from({ length: 64 }).map((_, i) => {
                      // Padrão fixo para QR code mockup (evita erro de hidratação)
                      const isWhite = [0,1,2,3,4,5,6,7,8,15,16,23,24,31,32,39,40,47,48,55,56,57,58,59,60,61,62,63].includes(i);
                      return (
                        <div key={i} className={`${isWhite ? 'bg-white' : ''} rounded-[1px]`}></div>
                      );
                    })}
                  </div>

                  {/* URL Mockup */}
                  <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600 mb-3">
                    quizinho.me/meu-amor
                  </div>

                  {/* Share Buttons Mockup */}
                  <div className="flex justify-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-blue-700 rounded-full"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                  </div>

                  {/* Success Text */}
                  <p className="text-center text-xs text-gray-600 mt-3">
                    ✨ Quiz criado com sucesso!
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      <div className="relative flex flex-col gap-32 w-full px-4 py-32 sm:px12 lg:px-32 2xl:px-64 bg-gradient-to-br from-foreground/10 to-background mask">

        <Image src={"/noise2.svg"} alt="noise" fill className="object-cover opacity-10" />

        <section className="grid grid-rows-2 lg:grid-cols-[50%,35%] lg:grid-rows-1 justify-between gap-12 relative">
          <div className="w-full lg:aspect-video flex flex-col border border-white rounded-2xl relative">
            <div className="w-full h-12 bg-neutral-900 rounded-t-2xl flex justify-between items-center relative px-2.5 lg:px-5">
              <div className="size-5">
                <Image src="/quizinho-light-purple.svg" alt="quizinho logo" width={20} height={20} />
              </div>

              <ul className="flex gap-2 items-center h-full">
                <li className="size-2 bg-neutral-200 rounded-full"></li>
                <li className="size-2 bg-neutral-400 rounded-full"></li>
                <li className="size-2 bg-neutral-600 rounded-full"></li>
              </ul>
            </div>

            <QuizinhoExample className="w-full h-full bg-background flex flex-col justify-center items-center overflow-hidden rounded-b-2xl" />

            <div className="absolute bottom-0 right-0 translate-y-1/2 lg:translate-x-1/2">
              <Image src={"/quizinho-logo-alt.png"} alt="Quizinho logo" height={100} width={100} className="w-12 h-12 lg:w-full lg:h-full" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-5">
            <h3 className="text-2xl lg:text-4xl font-medium text-nowrap">Crie seu Quizinho</h3>

            <ul className="flex flex-col text-start text-lg lg:text-xl gap-5">
              <li className="flex items-start gap-2">
                <Square className="shrink-0 w-2 fill-green-500 stroke-green-500" />
                Seu Quizinho fácil e rápido: Não precisa de conta ou login para criar e compartilhar seu Quizinho.
              </li>

              <li className="flex items-start gap-2">
                <Square className="shrink-0 w-2 fill-green-500 stroke-green-500" />
                Personalize seu Quizinho com uma váriedade de temas.
              </li>

              <li className="flex items-start gap-2">
                <Square className="shrink-0 w-2 fill-green-500 stroke-green-500" />
                Compartilhe seu Quizinho com facilidade através de um QR Code único ou URL customizável.
              </li>

              <li className="flex items-start gap-2">
                <Square className="shrink-0 w-2 fill-green-500 stroke-green-500" />
                Ideal para momentos especiais: Crie quizzes para surpreender seu amor, amigos ou familiares de forma divertida e interativa.
              </li>
            </ul>
          </div>
        </section>

        <section className="w-full flex flex-col gap-12 items-center justify-center relative px-4 sm:px-8">
          <div className="text-center flex flex-col gap-2 max-w-3xl">
            <h3 className="text-2xl lg:text-4xl font-medium">Temas</h3>
            <p className="text-lg font-normal text-muted-foreground">Escolha entre diferentes temas e personalize seus Quizinhos do jeito que quiser!</p>
          </div>

          <div className="w-full max-w-6xl">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
            {Themes.map((theme, index) => (
              <li key={index} className="flex flex-col gap-2 overflow-hidden">
                <Image src={theme.path} alt={theme.title} width={1080} height={1080} className="w-full aspect-video bg-foreground/10 rounded-lg " />

                <span className="px-5 font-medium text-lg">{theme.title}</span>
              </li>
            ))}
            </ul>
          </div>
        </section>

        <section className="w-full flex flex-col items-center justify-center gap-12 relative px-4 sm:px-8">
          <div className="text-center flex flex-col gap-2 max-w-3xl">
            <h3 className="text-2xl lg:text-4xl font-medium">Planos</h3>
            <p className="text-lg font-normal text-muted-foreground">Selecione o plano ideal para você e aproveite todas as vantagens do Quizinho!</p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
              <Plans />
            </div>
          </div>
        </section>
      </div>

      <section
        id="quizinho"
        className="relative w-full px-4 mt-32 sm:px-12 lg:px-32 2xl:px-64"
        aria-labelledby="quiz-creation-heading"
        role="region"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header da Seção */}
          <div className="text-center mb-12">
            <h3 id="quiz-creation-heading" className="text-3xl lg:text-5xl font-bold mb-4">Crie Seu Quiz</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Construa seu quiz personalizado em poucos passos simples e compartilhe com quem você ama
            </p>
          </div>

          {/* Layout Grid Principal */}
          <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12 items-start">
            {/* Painel de Criação */}
            <div className="space-y-8">
              {/* Formulário de Nova Pergunta */}
              <Card className="p-6 bg-gradient-to-br from-background to-muted/30 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Nova Pergunta {questions.length > 0 && `(${questions.length + 1})`}
                  </CardTitle>
                  <CardDescription>
                    Crie uma pergunta única sobre você para testar o conhecimento de quem você ama
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Input da Pergunta */}
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-sm font-medium">
                      Sua pergunta <span className="text-red-500">*</span>
                    </Label>
                    <div className={`relative ${
                      question.length > 0 ? 'border-green-500' : 'border-muted-foreground'
                    } border rounded-lg transition-colors`}>
                      <Input
                        id="question"
                        placeholder="Ex: Qual é a minha comida favorita?"
                        value={question}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const hasValue = e.currentTarget.value.length > 0;
                          if (hasValue !== inputHasValue) {
                            setInputHasValue(hasValue);
                          }
                          setQuestion(e.currentTarget.value)
                        }}
                        className="border-none focus-visible:ring-0 h-12 text-base pr-12"
                      />
                      {question.length > 0 && (
                        <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {question.length > 0 && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Pergunta válida
                      </p>
                    )}
                  </div>

                  {/* Alternativas */}
                  {inputHasValue && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                      <Label className="text-sm font-medium">
                        Alternativas <span className="text-red-500">*</span>
                        <span className="text-xs text-muted-foreground ml-2">(mínimo 2)</span>
                      </Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.from({ length: questionsAmount }).map((_, index) => (
                          <div key={index} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Alternativa {index + 1} {index < 2 && <span className="text-red-500">*</span>}
                            </Label>
                            <div className={`relative ${
                              (alternatives[index] || '').length > 0 ? 'border-green-500' : 'border-muted-foreground'
                            } border rounded-md transition-colors`}>
                              <Input
                                placeholder={`Opção ${index + 1}`}
                                value={alternatives[index] || ''}
                                onChange={(e: { target: { value: string; }; }) => {
                                  const newAlternatives = [...alternatives];
                                  newAlternatives[index] = e.target.value || '';
                                  setAlternatives(newAlternatives);
                                }}
                                className="border-none focus-visible:ring-0 h-11 pr-8"
                              />
                              {(alternatives[index] || '').length > 0 && (
                                <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Seleção da Resposta Correta */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Resposta correta <span className="text-red-500">*</span>
                        </Label>
                        <Select value={correctAlternative || undefined} onValueChange={(alternative) => setCorrectAlternative(alternative)}>
                          <SelectTrigger className={`h-11 ${
                            correctAlternative ? 'border-green-500' : 'border-muted-foreground'
                          }`}>
                            <SelectValue placeholder="Selecione a alternativa correta" />
                          </SelectTrigger>
                          <SelectContent>
                            {alternatives.map((alt, index) => (
                              alt.length > 0 ? (
                                <SelectItem key={index} value={alt}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                      {index + 1}
                                    </span>
                                    {alt}
                                  </div>
                                </SelectItem>
                              ) : null
                            ))}
                          </SelectContent>
                        </Select>
                        {correctAlternative && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Resposta definida
                          </p>
                        )}
                      </div>

                      {/* Botão Criar Pergunta */}
                      <Button
                        onClick={handleQuestionCreate}
                        disabled={!question || alternatives.filter(alt => alt.length > 0).length < 2 || !correctAlternative}
                        className="w-full h-12 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Pergunta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lista de Perguntas Criadas */}
              {questions.length > 0 && (
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Perguntas Criadas ({questions.length})
                    </CardTitle>
                    <CardDescription>
                      Suas perguntas estão prontas! Você pode editá-las ou criar o quiz.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions.map((question, index) => (
                        <div key={index} className="p-4 border border-muted-foreground/30 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium mb-2 text-sm text-foreground">
                                {index + 1}. {question.question}
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {question.alternatives.map((alt, altIndex) => (
                                  <span
                                    key={altIndex}
                                    className={`text-xs px-2 py-1 rounded ${
                                      alt === question.correctAlternative
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditStart(question)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedQuestions = questions.filter((_, i) => i !== index);
                                  setQuestions(updatedQuestions);
                                }}
                                className="text-muted-foreground hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Botão Criar Quiz */}
                    <div className="mt-6 pt-6 border-t">
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                        disabled={questions.length < 2}
                        onClick={() => router.push(pathname + '?' + createQueryString('modal', 'true', searchParams), { scroll: false })}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Criar Meu Quiz ({questions.length} perguntas)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Painel de Preview - Lado Direito */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="p-6 bg-gradient-to-br from-muted/50 to-background border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Preview do Quiz
                  </CardTitle>
                  <CardDescription>
                    Veja como seu quiz aparecerá para quem for responder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">
                        Adicione sua primeira pergunta para ver o preview
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Mock de pergunta atual */}
                      <div className="p-4 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground">
                            Pergunta 1 de {questions.length}
                          </span>
                          <div className="flex gap-1">
                            {Array.from({ length: questions.length }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i === 0 ? 'bg-primary' : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <h3 className="font-medium mb-4 text-sm">
                          {questions[0]?.question}
                        </h3>
                        <div className="space-y-2">
                          {questions[0]?.alternatives.map((alt, index) => (
                            <div
                              key={index}
                              className="p-3 border rounded-md text-sm hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              {alt}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">
                            {questions.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Perguntas
                          </div>
                        </div>
                        <div className="p-3 bg-violet-500/10 rounded-lg">
                          <div className="text-lg font-bold text-violet-600">
                            ~{questions.length * 30}s
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Duração
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Criação do Quiz */}
      <Dialog defaultOpen={modalOpen}>
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          {!loading && !qrCodeURL && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Finalizar seu Quiz</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Escolha o plano ideal para compartilhar seu quiz:
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Plans />
              </div>

              <DialogFooter className="flex flex-row justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  onClick={handleCreateQuizinho}
                  className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white"
                  disabled={!selectedPlan || (selectedPlan === 'premium' && (customURL.length < 5 || invalidURLS.includes(customURL.toLowerCase())))}
                >
                  Criar Quiz
                </Button>
              </DialogFooter>
            </>
          )}

          {loading && !qrCodeURL && (
            <div className="py-8 text-center">
              <DialogHeader>
                <DialogTitle>Criando seu Quiz...</DialogTitle>
                <DialogDescription>
                  Aguarde enquanto preparamos tudo para você
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <Loader />
              </div>
            </div>
          )}

          {!loading && qrCodeURL && (
            <>
              <DialogHeader>
                <DialogTitle>Quiz Criado com Sucesso! 🎉</DialogTitle>
                <DialogDescription>
                  Compartilhe o QR Code ou link com quem você ama:
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  {/* @ts-ignore */}
                  <qr-code contents={qrCodeURL} squares />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Link do Quiz:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={qrCodeURL}
                      readOnly
                      className="flex-1 bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(qrCodeURL);
                        toast.success("Link copiado!");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button asChild className="w-full">
                  <a href={qrCodeURL} target="_blank" rel="noopener noreferrer">
                    Ver Quiz
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

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
        <span>© Quizinho {format(new Date, 'yyyy')}. Todos os direitos reservados.</span>
      </div>

            </main>
          )
        }}
      </SearchParamsWrapper>
    </Suspense>
  )
}