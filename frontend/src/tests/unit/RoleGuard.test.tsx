import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RoleGuard } from '../../router/route-guards/RoleGuard';
import { Role } from '../../types/Roles';
import { routes } from '../../router';

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

describe('RoleGuard', () => {
  const ProtectedPage = () => <div>Allowed Page</div>;
  const ForbiddenPage = () => <div>Forbidden Page</div>;

  const renderWithRouter = (
    allowedRoles: Role[],
    initialEntries = ['/protected'],
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<RoleGuard allowedRoles={allowedRoles} />}>
            <Route path="/protected" element={<ProtectedPage />} />
          </Route>
          <Route path={`/${routes.forbidden}`} element={<ForbiddenPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders nothing if user is null and not loading', () => {
    useAuthContextMock.mockReturnValue({ user: null, isLoading: false });

    const { container } = renderWithRouter([Role.ADMIN]);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing if user is loading', () => {
    useAuthContextMock.mockReturnValue({ user: null, isLoading: true });

    const { container } = renderWithRouter([Role.ADMIN]);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders protected content if user role is allowed', () => {
    useAuthContextMock.mockReturnValue({
      user: { id: '1', role: Role.ADMIN },
      isLoading: false,
    });

    renderWithRouter([Role.ADMIN, Role.USER]);
    expect(screen.getByText('Allowed Page')).toBeInTheDocument();
  });

  it('redirects to forbidden page if user role is not allowed', () => {
    useAuthContextMock.mockReturnValue({
      user: { id: '1', role: Role.USER },
      isLoading: false,
    });

    renderWithRouter([Role.ADMIN]);
    expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
  });
});
