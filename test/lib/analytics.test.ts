import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { trackEvent, trackQuizEvent, trackUI, trackError, getConversionFunnel } from '@/lib/analytics'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('Analytics System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    consoleSpy.mockClear()
  })

  describe('trackEvent', () => {
    it('should track basic events correctly', () => {
      trackEvent('test', 'click', 'button', 1)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'test_click',
          category: 'test',
          action: 'click',
          label: 'button',
          value: 1
        })
      )
    })

    it('should include session and user data', () => {
      trackEvent('navigation', 'page_view')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          session_id: expect.stringMatching(/^session_/),
          user_id: expect.stringMatching(/^user_/),
          timestamp: expect.any(Number),
          device_type: expect.any(String),
          viewport: expect.objectContaining({
            width: expect.any(Number),
            height: expect.any(Number)
          })
        })
      )
    })

    it('should handle custom data', () => {
      const customData = { plan: 'premium', price: 5 }
      trackEvent('conversion', 'purchase', 'premium', 5, customData)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          custom_data: customData
        })
      )
    })
  })

  describe('trackQuizEvent', () => {
    it('should track quiz creation start', () => {
      trackQuizEvent.creationStart()

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'quiz_creation_start',
          category: 'quiz',
          action: 'creation_start'
        })
      )
    })

    it('should track question addition with number', () => {
      trackQuizEvent.questionAdded(3)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'quiz_question_added',
          category: 'quiz',
          action: 'question_added',
          label: 'question_3',
          value: 3
        })
      )
    })

    it('should track plan selection', () => {
      trackQuizEvent.planSelected('premium', 5)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'conversion_plan_select',
          category: 'conversion',
          action: 'plan_select',
          label: 'premium',
          value: 5
        })
      )
    })

    it('should track quiz completion', () => {
      trackQuizEvent.quizCreated('free', 2)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'conversion_quiz_created',
          category: 'conversion',
          action: 'quiz_created',
          label: 'free',
          value: 2
        })
      )
    })
  })

  describe('trackUI', () => {
    it('should track UI interactions', () => {
      trackUI('hero_button', 'click', { variant: 'control' })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'ui_click',
          category: 'ui',
          action: 'click',
          label: 'hero_button',
          custom_data: { variant: 'control' }
        })
      )
    })

    it('should track different UI actions', () => {
      trackUI('menu', 'hover')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          action: 'hover',
          label: 'menu'
        })
      )
    })
  })

  describe('trackError', () => {
    it('should track errors with details', () => {
      const errorDetails = {
        stack: 'Error stack trace',
        component: 'QuizCreator'
      }

      trackError('validation_failed', errorDetails)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics]',
        expect.objectContaining({
          event: 'error_occurred',
          category: 'error',
          action: 'occurred',
          label: 'validation_failed',
          custom_data: errorDetails
        })
      )
    })
  })

  describe('getConversionFunnel', () => {
    it('should return empty funnel when no data exists', () => {
      // Mock empty localStorage
      const originalKeys = Object.keys
      Object.keys = vi.fn().mockImplementation((obj) => {
        if (obj === localStorage) {
          return []
        }
        return originalKeys(obj)
      })

      const funnel = getConversionFunnel()

      expect(funnel).toEqual({
        visitors: 0,
        engaged: 0,
        creators: 0,
        converted: 0,
        engagement_rate: 0,
        creation_rate: 0,
        conversion_rate: 0
      })

      // Restore Object.keys
      Object.keys = originalKeys
    })

    it('should calculate funnel metrics correctly', () => {
      const mockSessions = [
        {
          journey: { funnel_stage: 'visitor' },
          events: []
        },
        {
          journey: { funnel_stage: 'engaged' },
          events: []
        },
        {
          journey: { funnel_stage: 'creator' },
          events: []
        },
        {
          journey: { funnel_stage: 'converted' },
          events: []
        }
      ]

      // Mock localStorage keys
      const sessionKeys = mockSessions.map((_, i) => `analytics_session_${i}`)
      Object.defineProperty(localStorage, 'length', { value: sessionKeys.length })

      // Mock Object.keys to return session keys
      const originalKeys = Object.keys
      Object.keys = vi.fn().mockImplementation((obj) => {
        if (obj === localStorage) {
          return sessionKeys
        }
        return originalKeys(obj)
      })

      localStorageMock.getItem.mockImplementation((key) => {
        const index = sessionKeys.indexOf(key)
        if (index !== -1) {
          return JSON.stringify(mockSessions[index])
        }
        return null
      })

      const funnel = getConversionFunnel()

      expect(funnel).toEqual({
        visitors: 4,
        engaged: 3,
        creators: 2,
        converted: 1,
        engagement_rate: 75, // 3/4 * 100
        creation_rate: expect.closeTo(66.67, 0.1), // 2/3 * 100
        conversion_rate: 50 // 1/2 * 100
      })

      // Restore Object.keys
      Object.keys = originalKeys
    })
  })
})