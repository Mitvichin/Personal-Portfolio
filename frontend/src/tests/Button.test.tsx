import { render, screen } from '@testing-library/react';
import { Button } from '../components/shared';

test('renders component text', () => {
  render(<Button>Hello</Button>);
  expect(screen.getByText(/Hello/i)).toBeInTheDocument();
});
