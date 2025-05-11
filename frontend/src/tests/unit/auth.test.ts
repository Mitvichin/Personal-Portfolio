import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuthService } from '../../services/auth';
import { User } from '../../types/User';
import { Role } from '../../types/Roles';

const mockAppFetch = vi.fn();
const mockGetCSRFToken = vi.fn();

vi.mock('../../hooks/useAppFetch', () => ({
  useAppFetch: () => mockAppFetch,
}));

vi.mock('../../services/getCSRFToken', () => ({
  getCSRFToken: () => mockGetCSRFToken(),
}));

describe('useAuthService', () => {
  const user: User = {
    id: '1',
    email: 'auth@test.com',
    role: Role.USER,
    firstName: 'Test',
    lastName: 'Testov',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registerUser sends POST request and returns response json', async () => {
    const fakeResponse = { json: vi.fn() };
    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.registerUser({
        email: 'a@b.com',
        password: '123',
        firstName: 'Test',
        lastName: 'Testov',
      });
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'a@b.com',
          password: '123',
          firstName: 'Test',
          lastName: 'Testov',
        }),
      }),
    );
    expect(fakeResponse.json).toHaveBeenCalled();
  });

  it('login calls fetch and getCSRFToken, returns user', async () => {
    const fakeResponse = new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    mockAppFetch.mockResolvedValueOnce(fakeResponse);
    mockGetCSRFToken.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuthService());

    let returnedUser: User;

    await act(async () => {
      returnedUser = await result.current.login({
        email: 'test@test.com',
        password: 'secret',
      });
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(mockGetCSRFToken).toHaveBeenCalled();
    expect(returnedUser!).toEqual(user);
  });

  it('logout calls fetch and getCSRFToken', async () => {
    mockAppFetch.mockResolvedValueOnce({});
    mockGetCSRFToken.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(mockGetCSRFToken).toHaveBeenCalled();
  });

  it('verifyAuth fetches user', async () => {
    const fakeResponse = new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    mockAppFetch.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() => useAuthService());

    let authUser: User;

    await act(async () => {
      authUser = await result.current.verifyAuth();
    });

    expect(mockAppFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/verify-authentication'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(authUser!).toEqual(user);
  });
  it('registerUser throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Register failed'));

    const { result } = renderHook(() => useAuthService());

    await expect(
      result.current.registerUser({
        email: 'fail@x.com',
        password: '123',
        firstName: 'fail',
        lastName: 'failov',
      }),
    ).rejects.toThrow('Register failed');
  });

  it('login throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Login failed'));

    const { result } = renderHook(() => useAuthService());

    await expect(
      result.current.login({ email: 'fail@x.com', password: 'wrong' }),
    ).rejects.toThrow('Login failed');
  });

  it('logout throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Logout failed'));

    const { result } = renderHook(() => useAuthService());

    await expect(result.current.logout()).rejects.toThrow('Logout failed');
  });

  it('verifyAuth throws if fetch fails', async () => {
    mockAppFetch.mockRejectedValueOnce(new Error('Verification failed'));

    const { result } = renderHook(() => useAuthService());

    await expect(result.current.verifyAuth()).rejects.toThrow(
      'Verification failed',
    );
  });
});
