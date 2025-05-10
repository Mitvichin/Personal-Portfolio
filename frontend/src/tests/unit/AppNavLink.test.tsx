import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { AppNavLink } from '../../components/shared';

vi.mock('../../utils/constants', async () => {
  const actual = await vi.importActual('../../utils/constants');
  return {
    ...actual,
    GET_BUTTON_CLASS_NAME: (input: string = '') => `btn-base ${input}`,
  };
});

describe('AppNavLink', () => {
  it('renders link with correct text and computed class name', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppNavLink to="/dashboard" className="custom-class">
          Dashboard
        </AppNavLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link.className).toContain('btn-base custom-class');
  });

  it('applies active class when route matches', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppNavLink to="/profile" className="test-link">
          Profile
        </AppNavLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Profile' });
    expect(link.className).toContain('border-y-blue-600');
    expect(link.className).toContain('border-x-blue-600');
  });

  it('does not apply active class when route does not match', () => {
    render(
      <MemoryRouter initialEntries={['/other']}>
        <AppNavLink to="/profile" className="test-link">
          Profile
        </AppNavLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Profile' });
    expect(link.className).not.toContain('border-y-blue-600');
    expect(link.className).not.toContain('border-x-blue-600');
  });
});
