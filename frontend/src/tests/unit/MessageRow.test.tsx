import { render, screen, fireEvent, act } from '@testing-library/react';
import { Message } from '../../types/Message';
import { MessageRow } from '../../components/message-table/MessageRow';
import { ReactNode } from 'react';

describe('MessageRow Component', () => {
  const renderRow = (row: ReactNode) =>
    render(
      <table>
        <tbody>{row}</tbody>
      </table>,
    );

  const mockMessage: Message = {
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    message: 'This is a test message',
  };

  const mockOnRowClick = vi.fn();

  it('renders message data correctly', () => {
    renderRow(<MessageRow data={mockMessage} onRowClick={mockOnRowClick} />);

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('calls onRowClick when the row is clicked', async () => {
    renderRow(<MessageRow data={mockMessage} onRowClick={mockOnRowClick} />);

    await act(async () => {
      await fireEvent.click(screen.getByText('user@example.com'));
    });

    expect(mockOnRowClick).toHaveBeenCalledWith(mockMessage);
  });

  it('should apply the hover and cursor styles', () => {
    renderRow(<MessageRow data={mockMessage} onRowClick={mockOnRowClick} />);

    const row = screen.getByText('user@example.com').closest('tr');

    expect(row).toHaveClass('hover:bg-gray-50');
    expect(row).toHaveClass('cursor-pointer');
  });
});
