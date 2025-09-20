export interface Alternative {
  alternative: string;
  correct: boolean;
}

export interface Question {
  question: string;
  alternatives: Alternative[];
}

export interface QuizinhoData {
  quizinho: Question[];
  img: string; // URL do QR code
  plan: 'free' | 'premium';
  paid: boolean;
  theme?: string;
  creationTime?: any; // Firebase Timestamp
}

export interface CreateQuizinhoRequest {
  questions: Question[];
  customURL?: string;
  plan: 'free' | 'premium';
  id?: string; // oldId para atualizações
  theme?: string;
}

export interface CreateQuizinhoResponse {
  quizinho?: string;
  payment?: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      client_reference_id: string;
    };
  };
}