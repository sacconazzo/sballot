import { render, screen } from '@testing-library/react'
import Dashboard from './comps/Dashboard'

test('renders learn react link', () => {
  render(<Dashboard />)
  const linkElement = screen.getByText(/sBallottaggio/i)
  expect(linkElement).toBeInTheDocument()
})
