import { describe, it, expect } from 'vitest'
import { isValidQuizQuestion, isValidQuizPlan, isAPIError } from '@/types/quiz'
import type { QuizQuestion, APIError } from '@/types/quiz'

describe('Quiz Type Guards and Utilities', () => {
  describe('isValidQuizQuestion', () => {
    it('should validate a correct quiz question with 4 alternatives', () => {
      const validQuestion: QuizQuestion = {
        question: 'What is the capital of Brazil?',
        alternatives: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
        correctAlternative: 'Brasília'
      }

      expect(isValidQuizQuestion(validQuestion)).toBe(true)
    })

    it('should validate a correct quiz question with 2 alternatives', () => {
      const validQuestion: QuizQuestion = {
        question: 'Is this a yes or no question?',
        alternatives: ['Yes', 'No'],
        correctAlternative: 'Yes'
      }

      expect(isValidQuizQuestion(validQuestion)).toBe(true)
    })

    it('should validate a correct quiz question with 3 alternatives', () => {
      const validQuestion: QuizQuestion = {
        question: 'Which is correct?',
        alternatives: ['Option A', 'Option B', 'Option C'],
        correctAlternative: 'Option B'
      }

      expect(isValidQuizQuestion(validQuestion)).toBe(true)
    })

    it('should reject question with empty question text', () => {
      const invalidQuestion = {
        question: '',
        alternatives: ['A', 'B'],
        correctAlternative: 'A'
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })

    it('should reject question with missing question text', () => {
      const invalidQuestion = {
        alternatives: ['A', 'B'],
        correctAlternative: 'A'
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })

    it('should reject question with less than 2 alternatives', () => {
      const invalidQuestion = {
        question: 'Valid question?',
        alternatives: ['Only one'],
        correctAlternative: 'Only one'
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })

    it('should reject question with more than 4 alternatives', () => {
      const invalidQuestion = {
        question: 'Valid question?',
        alternatives: ['A', 'B', 'C', 'D', 'E'],
        correctAlternative: 'A'
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })

    it('should reject question with correct alternative not in alternatives list', () => {
      const invalidQuestion = {
        question: 'Valid question?',
        alternatives: ['A', 'B'],
        correctAlternative: 'C'
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })

    it('should reject question with missing correct alternative', () => {
      const invalidQuestion = {
        question: 'Valid question?',
        alternatives: ['A', 'B'],
        correctAlternative: ''
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })

    it('should reject question with missing alternatives', () => {
      const invalidQuestion = {
        question: 'Valid question?',
        correctAlternative: 'A'
      }

      expect(isValidQuizQuestion(invalidQuestion)).toBe(false)
    })
  })

  describe('isValidQuizPlan', () => {
    it('should validate "free" plan', () => {
      expect(isValidQuizPlan('free')).toBe(true)
    })

    it('should validate "premium" plan', () => {
      expect(isValidQuizPlan('premium')).toBe(true)
    })

    it('should reject invalid plan strings', () => {
      expect(isValidQuizPlan('basic')).toBe(false)
      expect(isValidQuizPlan('pro')).toBe(false)
      expect(isValidQuizPlan('')).toBe(false)
      expect(isValidQuizPlan('PREMIUM')).toBe(false) // Case sensitive
    })

    it('should reject non-string values', () => {
      expect(isValidQuizPlan(null as any)).toBe(false)
      expect(isValidQuizPlan(undefined as any)).toBe(false)
      expect(isValidQuizPlan(123 as any)).toBe(false)
      expect(isValidQuizPlan({} as any)).toBe(false)
    })
  })

  describe('isAPIError', () => {
    it('should validate correct API error structure', () => {
      const apiError: APIError = {
        status: 400,
        message: 'Bad Request',
        code: 'VALIDATION_ERROR',
        details: { field: 'email' }
      }

      expect(isAPIError(apiError)).toBe(true)
    })

    it('should validate minimal API error structure', () => {
      const apiError = {
        status: 500,
        message: 'Internal Server Error'
      }

      expect(isAPIError(apiError)).toBe(true)
    })

    it('should reject objects missing status', () => {
      const invalidError = {
        message: 'Error message'
      }

      expect(isAPIError(invalidError)).toBe(false)
    })

    it('should reject objects missing message', () => {
      const invalidError = {
        status: 400
      }

      expect(isAPIError(invalidError)).toBe(false)
    })

    it('should reject non-objects', () => {
      expect(isAPIError('error string')).toBe(false)
      expect(isAPIError(404)).toBe(false)
      expect(isAPIError(null)).toBe(false)
      expect(isAPIError(undefined)).toBe(false)
    })

    it('should reject Error instances (different from APIError)', () => {
      const jsError = new Error('Standard JS Error')
      expect(isAPIError(jsError)).toBe(false)
    })
  })
})