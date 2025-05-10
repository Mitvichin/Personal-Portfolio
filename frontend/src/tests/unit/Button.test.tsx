import { render, screen, fireEvent, getByTestId } from '@testing-library/react';
import { Button } from '../../components/shared';
import { act } from 'react';

describe('Button component', () => {
  it('renders children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies custom type', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await act(async () => {
      await fireEvent.click(screen.getByRole('button'));
    });

    expect(handleClick).toHaveBeenCalled();
  });

  it('does not call onClick if disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isDisabled>
        Disabled
      </Button>,
    );

    await act(async () => {
      await fireEvent.click(screen.getByRole('button'));
    });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled when isDisabled is true', () => {
    render(<Button isDisabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<Button isLoading>Loading...</Button>);
    const loader = getByTestId(screen.getByRole('button'), 'loading-spiner');

    expect(loader).toBeInTheDocument();
  });

  it('hides text when loading', () => {
    render(<Button isLoading>Loading Text</Button>);
    const text = screen.getByText('Loading Text');
    expect(text).toHaveClass('opacity-0');
  });

  it('applies custom class name from GET_BUTTON_CLASS_NAME', () => {
    render(<Button className="custom-class">Styled</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
