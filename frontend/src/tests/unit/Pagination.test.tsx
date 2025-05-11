import { render, screen, fireEvent, act } from '@testing-library/react';
import { Pagination } from '../../components/shared/Pagination';

describe('Pagination', () => {
  it('renders current page and total', () => {
    render(<Pagination total={5} onPageChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('of')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination total={3} onPageChange={() => {}} />);
    const prevButton = screen.getByRole('button', { name: 'Previous' });
    expect(prevButton).toBeDisabled();
  });

  it('calls onPageChange when next is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination total={3} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(async () => {
      await fireEvent.click(nextButton);
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it('navigates forward and backward correctly', async () => {
    const onPageChange = vi.fn();
    render(<Pagination total={3} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const prevButton = screen.getByRole('button', { name: 'Previous' });

    await act(async () => {
      await fireEvent.click(nextButton);
    });

    await act(async () => {
      await fireEvent.click(nextButton);
    });

    await act(async () => {
      await fireEvent.click(prevButton);
    });

    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 2);
  });

  it('disables next button on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination total={1} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();
  });
});
