import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('should render with default variant', () => {
    render(<Badge>Default Badge</Badge>)

    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary')
  })

  it('should render with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)

    const badge = screen.getByText('Secondary Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-secondary')
  })

  it('should render with destructive variant', () => {
    render(<Badge variant="destructive">Error Badge</Badge>)

    const badge = screen.getByText('Error Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-destructive')
  })

  it('should render with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)

    const badge = screen.getByText('Outline Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-foreground')
  })

  it('should accept additional className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)

    const badge = screen.getByText('Custom Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('custom-class')
  })

  it('should forward props to div element', () => {
    render(<Badge data-testid="test-badge">Test Badge</Badge>)

    const badge = screen.getByTestId('test-badge')
    expect(badge).toBeInTheDocument()
  })

  it('should be a div element', () => {
    render(<Badge>Badge Content</Badge>)

    const badge = screen.getByText('Badge Content')
    expect(badge.tagName).toBe('DIV')
  })

  it('should have correct base classes', () => {
    render(<Badge>Base Badge</Badge>)

    const badge = screen.getByText('Base Badge')
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold')
  })
})