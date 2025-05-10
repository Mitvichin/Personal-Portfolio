import { render, screen } from '@testing-library/react';
import { Role } from '../../types/Roles';
import { HasRole } from '../../decorators/HasRole';

const { useAtuhContextMock, mockedAuthContext } = vi.hoisted(() => {
  const useAtuhContextMock = vi.fn();
  const actual = vi.importActual('../../providers/auth/AuthContext');

  const mockedAuthContext = {
    ...actual,
    useAuthContext: useAtuhContextMock,
  };

  return { useAtuhContextMock, mockedAuthContext };
});

vi.mock('../../providers/auth/AuthContext', () => mockedAuthContext);

describe('HasRole Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user has one of the required roles', () => {
    useAtuhContextMock.mockReturnValue({
      user: { role: Role.ADMIN },
    });

    render(
      <HasRole roles={['admin', 'user']}>
        <p>Visible to admin</p>
      </HasRole>,
    );

    expect(screen.getByText('Visible to admin')).toBeInTheDocument();
  });

  it('does not render children when user does not have the required role', () => {
    useAtuhContextMock.mockReturnValue({
      user: { role: Role.USER },
    });

    render(
      <HasRole roles={['admin']}>
        <p>Hidden from user</p>
      </HasRole>,
    );

    expect(screen.queryByText('Hidden from user')).toBeNull();
  });

  it('does not render children when there is no user', () => {
    useAtuhContextMock.mockReturnValue({ user: null });

    render(
      <HasRole roles={['admin']}>
        <p>Hidden from anonymous</p>
      </HasRole>,
    );

    expect(screen.queryByText('Hidden from anonymous')).toBeNull();
  });
});
