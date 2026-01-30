import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'
import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
vi.mock('../../widgets/Header/Header', () => ({
  Header: () => <div data-testid="header">Header</div>
}))

vi.mock('@tanstack/react-router', () => ({
  ScrollRestoration: () => null,
  Link: () => <a href="/">Mock Link</a>
}))

describe('Layout', () => {
    it('renders children correctly', () => {
        render(
            <Layout>
                <div data-testid="child">Child Content</div>
            </Layout>
        )
        expect(screen.getByTestId('child')).toBeInTheDocument()
        expect(screen.getByText('Child Content')).toBeInTheDocument()
        expect(screen.getByTestId('header')).toBeInTheDocument()
    })
})
