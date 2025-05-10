import { render, screen, fireEvent, act } from '@testing-library/react';
import { User } from '../../types/User';
import { UserRow } from '../../components/user-table/UserRow';
import { ReactNode } from 'react';

describe('UserRow', () => {
  const mockOnRowClick = vi.fn();

  const renderRow = (row: ReactNode) =>
    render(
      <table>
        <tbody>{row}</tbody>
      </table>,
    );

  const user: User = {
    id: '1',
    email: 'test@user.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
  };

  it('renders user data correctly', () => {
    renderRow(<UserRow data={user} onRowClick={mockOnRowClick} />);

    // Check for the user data in the table row
    expect(screen.getByText(user.id)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByText(user.firstName)).toBeInTheDocument();
    expect(screen.getByText(user.lastName)).toBeInTheDocument();
    expect(screen.getByText(user.role)).toBeInTheDocument();
  });

  it('calls onRowClick with correct user data when row is clicked', async () => {
    renderRow(<UserRow data={user} onRowClick={mockOnRowClick} />);

    const row = screen.getByRole('row');

    await act(async () => {
      await fireEvent.click(row);
    });

    expect(mockOnRowClick).toHaveBeenCalledWith(user);
    expect(mockOnRowClick).toHaveBeenCalledTimes(1);
  });
});
