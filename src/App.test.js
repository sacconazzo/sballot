import { render, screen } from '@testing-library/react'
import Winner from './comps/Winner'

test('First test', async () => {
  render(<Winner ballot={{ isOpen: true }} />)
  const linkElement = screen.getAllByText(/Winning/i)
  expect(linkElement[0]).toBeVisible()
})
