import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../providers/auth/AuthProvider';
import { AuthContext } from '../../providers/auth/AuthContext';
import { AppError } from '../../types/AppError';
import { vi } from 'vitest';

const { mockToastError, mockToastFactory } = vi.hoisted(() => {
  const mockToastError = vi.fn();
  const mockToastFactory = () => ({
    toast: { error: mockToastError },
  });

  return { mockToastError, mockToastFactory };
});

const { mockVerifyAuth, useAuthServiceFactory } = vi.hoisted(() => {
  const mockVerifyAuth = vi.fn();
  const useAuthServiceFactory = () => ({
    useAuthService: () => ({
      verifyAuth: mockVerifyAuth,
    }),
  });

  return { mockVerifyAuth, useAuthServiceFactory };
});

const { mockGetCSRFToken, mockGetCSRFTokenFactory } = vi.hoisted(() => {
  const mockGetCSRFToken = vi.fn();
  const mockGetCSRFTokenFactory = () => ({
    getCSRFToken: () => mockGetCSRFToken(),
  });

  return { mockGetCSRFToken, mockGetCSRFTokenFactory };
});

vi.mock('react-toastify', mockToastFactory);
vi.mock('../../services/auth', useAuthServiceFactory);
vi.mock('../../services/getCSRFToken', mockGetCSRFTokenFactory);

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <AuthContext.Consumer>
        {(value) => (
          <>
            <p>{value.isLoading ? 'Loading' : 'Loaded'}</p>
            <p>{value.user ? `User: ${value.user.firstName}` : 'No user'}</p>
          </>
        )}
      </AuthContext.Consumer>
    </AuthProvider>,
  );

describe('AuthProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets user on successful authentication', async () => {
    mockVerifyAuth.mockResolvedValue({ firstName: 'Test' });
    mockGetCSRFToken.mockResolvedValue(undefined);

    const { getByText } = renderWithProvider();

    await waitFor(() => {
      expect(getByText('Loaded')).toBeInTheDocument();
      expect(getByText('User: Test')).toBeInTheDocument();
    });
  });

  it('calls verifyAuth and keeps user as null on failure', async () => {
    mockVerifyAuth.mockRejectedValue(new Error('Unauthorized'));
    mockGetCSRFToken.mockResolvedValue(undefined);

    const { getByText } = renderWithProvider();

    await waitFor(() => {
      expect(getByText('Loaded')).toBeInTheDocument();
    });

    expect(getByText('No user')).toBeInTheDocument();

    expect(mockVerifyAuth).toHaveBeenCalled();
  });

  it('shows toast on CSRF fetch failure with AppError', async () => {
    mockVerifyAuth.mockResolvedValue(null);
    mockGetCSRFToken.mockRejectedValue(new AppError(500, 'CSRF error'));

    renderWithProvider();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('CSRF error');
    });
  });

  it('shows toast on CSRF fetch failure with generic error', async () => {
    mockVerifyAuth.mockResolvedValue(null);
    mockGetCSRFToken.mockRejectedValue(new Error('Random fail'));

    renderWithProvider();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Something went wrong! Please try again later!',
      );
    });
  });

  it('does not show toast on successful CSRF fetch', async () => {
    mockVerifyAuth.mockResolvedValue(null);
    mockGetCSRFToken.mockResolvedValue(undefined);

    renderWithProvider();

    await waitFor(() => {
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });
});
