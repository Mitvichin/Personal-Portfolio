import { render, screen } from '@testing-library/react';
import { Message } from '../../types/Message';
import { MessageDetails } from '../../components/message-table/MessageDetails';

describe('MessageDetails Component', () => {
  const mockMessage: Message = {
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    message: 'This is a test message',
  };

  it('renders message details correctly', () => {
    render(<MessageDetails message={mockMessage} />);

    // Check if the message data is rendered correctly
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('displays message field with correct styles', () => {
    render(<MessageDetails message={mockMessage} />);

    const messageElement = screen.getByText('This is a test message');

    expect(messageElement).toHaveClass('whitespace-pre-line');
    expect(messageElement).toHaveClass('overflow-auto');
    expect(messageElement).toHaveClass('max-h-72');
  });

  it('renders message details even with empty message fields', () => {
    render(<MessageDetails message={mockMessage} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });
});
