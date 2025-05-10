import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../components/shared';

describe('LoadingSpinner', () => {
  it('renders the spinner element', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spiner');
    expect(spinner).toBeInTheDocument();
  });

  it('has default class names applied', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spiner');
    expect(spinner.className).toContain('animate-spin');
    expect(spinner.className).toContain('inline-block');
    expect(spinner.className).toContain('size-4');
    expect(spinner.className).toContain('border-3');
    expect(spinner.className).toContain('text-white');
  });

  it('applies custom className if provided', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByTestId('loading-spiner');
    expect(spinner.className).toContain('custom-class');
  });
});
