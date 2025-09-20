import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getVariant, useABTest, trackConversion, getABTestStats, resetABTestData } from '@/lib/ab-testing'

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

describe('A/B Testing System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('getVariant', () => {
    it('should return control variant for invalid test', () => {
      const variant = getVariant('invalid_test')
      expect(variant).toBe('control')
    })

    it('should return a valid variant for cta_button test', () => {
      const variant = getVariant('cta_button')
      expect(['control', 'variant_a', 'variant_b']).toContain(variant)
    })

    it('should return consistent variant for same user', () => {
      localStorageMock.getItem.mockReturnValue('test_user_123')

      const variant1 = getVariant('cta_button')
      const variant2 = getVariant('cta_button')

      expect(variant1).toBe(variant2)
    })

    it('should distribute variants according to weights', () => {
      const results = { control: 0, variant_a: 0, variant_b: 0 }

      // Simulate 1000 different users
      for (let i = 0; i < 1000; i++) {
        localStorageMock.getItem.mockReturnValue(`user_${i}`)
        const variant = getVariant('cta_button')
        results[variant as keyof typeof results]++
      }

      // Control should have ~50%, variants ~25% each (with some tolerance)
      expect(results.control).toBeGreaterThan(400)
      expect(results.control).toBeLessThan(600)
      expect(results.variant_a).toBeGreaterThan(150)
      expect(results.variant_a).toBeLessThan(350)
      expect(results.variant_b).toBeGreaterThan(150)
      expect(results.variant_b).toBeLessThan(350)
    })
  })

  describe('trackConversion', () => {
    it('should store conversion data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      trackConversion('cta_button', 'click', 1)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ab_test_conversions',
        expect.stringContaining('cta_button')
      )
    })

    it('should limit stored conversions to 100', () => {
      // Mock existing 100 conversions
      const existingConversions = Array(100).fill(0).map((_, i) => ({
        testId: 'test',
        event: 'click',
        timestamp: new Date().toISOString(),
        userId: `user_${i}`
      }))

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingConversions))

      trackConversion('new_test', 'click', 1)

      const setItemCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'ab_test_conversions'
      )

      expect(setItemCall).toBeDefined()
      const storedData = JSON.parse(setItemCall[1])
      expect(storedData).toHaveLength(100)
      expect(storedData[storedData.length - 1].testId).toBe('new_test')
    })
  })

  describe('getABTestStats', () => {
    it('should return empty stats when no conversions exist', () => {
      localStorageMock.getItem.mockReturnValue('[]')

      const stats = getABTestStats()

      expect(stats).toBeDefined()
      expect(Object.keys(stats)).toHaveLength(4) // Number of tests in AB_TESTS
    })

    it('should calculate stats correctly with conversions', () => {
      const mockConversions = [
        {
          testId: 'cta_button',
          variant: 'control',
          event: 'click',
          value: 1,
          timestamp: new Date().toISOString()
        },
        {
          testId: 'cta_button',
          variant: 'variant_a',
          event: 'click',
          value: 1,
          timestamp: new Date().toISOString()
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockConversions))

      const stats = getABTestStats()

      expect(stats.cta_button.totalConversions).toBe(2)
      expect(stats.cta_button.variants.control.conversions).toBe(1)
      expect(stats.cta_button.variants.variant_a.conversions).toBe(1)
    })
  })

  describe('resetABTestData', () => {
    it('should clear all A/B test data from localStorage', () => {
      resetABTestData()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ab_test_user_id')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ab_test_conversions')
    })
  })
})