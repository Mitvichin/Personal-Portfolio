import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthGuard } from '../../router/route-guards/AuthGuard';
import { MemoryRouter, Route } from 'react-router';
import { Routes } from 'react-router';

const { useAuthContextMock, authContextFactory } = vi.hoisted(() => {
  const actual = vi.importActual('../../providers/auth/AuthContext');
  const useAuthContextMock = vi.fn();
  const authContextFactory = () => ({
    ...actual,
    useAuthContext: useAuthContextMock,
  });

  return { useAuthContextMock, authContextFactory };
});

vi.mock('../../providers/auth/AuthContext', authContextFactory);

describe('AuthGuard', () => {
  const TestComponent = () => <div>Protected content</div>;
  const LoginPage = () => <div>Login Page</div>;

  const renderWithRouter = (initialEntries = ['/protected']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('redirects to login if user is not authenticated and not loading', () => {
    useAuthContextMock.mockReturnValue({ user: null, isLoading: false });

    renderWithRouter();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content if user is authenticated', () => {
    useAuthContextMock.mockReturnValue({
      user: { id: '123' },
      isLoading: false,
    });

    renderWithRouter();

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('renders nothing if still loading', () => {
    useAuthContextMock.mockReturnValue({ user: null, isLoading: true });

    const { container } = renderWithRouter();

    expect(container).toBeEmptyDOMElement();
  });
});
