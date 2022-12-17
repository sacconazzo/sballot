import { render, screen } from '@testing-library/react'
import Winner from './comps/Winner'

test('renders learn react link', async () => {
  render(<Winner ballot={{ isOpen: true }} />)
  const linkElement = screen.getAllByTitle(/Winning/i)
  expect(linkElement).toBeInTheDocument()
})
