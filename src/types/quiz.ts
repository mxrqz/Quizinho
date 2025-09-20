// Types específicos para o Quizinho

export interface QuizQuestion {
  question: string;
  alternatives: [string, string, string, string] | [string, string, string] | [string, string]; // Mínimo 2, máximo 4
  correctAlternative: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  createdAt: Date;
  expiresAt: Date;
  plan: QuizPlan;
  customURL?: string;
  theme?: string;
  viewCount: number;
  completionRate: number;
}

export type QuizPlan = 'free' | 'premium';

export interface QuizCreationData {
  questions: QuizQuestion[];
  plan: QuizPlan;
  customURL?: string;
  theme?: string;
  id?: string;
}

export interface QuizCreationResponse {
  quizinho?: string; // URL do quiz criado
  payment?: string; // URL de pagamento para planos premium
  error?: string;
  message?: string;
}

export interface Theme {
  path: string;
  title: string;
  preview?: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface Plan {
  id: QuizPlan;
  name: string;
  price: number;
  currency: 'BRL';
  features: PlanFeature[];
  popular?: boolean;
  durationDays: number;
  maxQuestions?: number;
}

// Tipos para estados do formulário
export interface FormValidation {
  isValid: boolean;
  errors: string[];
  field?: string;
}

export interface QuestionFormState {
  question: string;
  alternatives: string[];
  correctAlternative: string;
  validation: FormValidation;
}

export interface QuizFormState {
  questions: QuizQuestion[];
  currentQuestion: QuestionFormState;
  selectedPlan: QuizPlan | null;
  customURL: string;
  selectedTheme: string;
  isLoading: boolean;
  qrCodeURL: string | null;
}

// Tipos para API
export interface APIError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: string;
}

// Tipos para analytics (futuro)
export interface QuizAnalytics {
  quizId: string;
  views: number;
  completions: number;
  completionRate: number;
  averageScore: number;
  responseTime: number;
  popularQuestions: number[];
  demographics?: {
    devices: Record<string, number>;
    browsers: Record<string, number>;
    referrers: Record<string, number>;
  };
}

// Event handlers
export interface QuizEventHandlers {
  onQuestionCreate: (question: QuizQuestion) => void;
  onQuestionEdit: (index: number, question: QuizQuestion) => void;
  onQuestionDelete: (index: number) => void;
  onPlanSelect: (plan: QuizPlan) => void;
  onThemeSelect: (theme: string) => void;
  onQuizCreate: (data: QuizCreationData) => Promise<void>;
  onFormValidate: (field: string, value: unknown) => FormValidation;
}

// Utility types
export type QuestionField = keyof QuestionFormState;
export type QuizField = keyof QuizFormState;
export type RequiredQuestionFields = 'question' | 'alternatives' | 'correctAlternative';

// Type guards
export const isValidQuizQuestion = (question: Partial<QuizQuestion>): question is QuizQuestion => {
  return !!(
    question.question &&
    question.alternatives &&
    question.alternatives.length >= 2 &&
    question.alternatives.length <= 4 &&
    question.correctAlternative &&
    question.alternatives.includes(question.correctAlternative)
  );
};

export const isValidQuizPlan = (plan: string): plan is QuizPlan => {
  return plan === 'free' || plan === 'premium';
};

export const isAPIError = (error: unknown): error is APIError => {
  return typeof error === 'object' && error !== null && 'status' in error && 'message' in error;
};