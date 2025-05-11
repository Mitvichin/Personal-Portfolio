import { render, screen } from '@testing-library/react';
import { User } from '../../types/User';
import { UserDetails } from '../../components/user-table/UserDetails';

describe('UserDetails', () => {
  const user: User = {
    id: '1',
    email: 'test@user.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
  };

  it('renders the user details correctly', () => {
    render(<UserDetails user={user} />);

    expect(screen.getByText(user.id)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByText(user.firstName)).toBeInTheDocument();
    expect(screen.getByText(user.lastName)).toBeInTheDocument();
    expect(screen.getByText(user.role)).toBeInTheDocument();
  });

  it('renders labels correctly', () => {
    render(<UserDetails user={user} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });
});
