import { renderHook } from '@testing-library/react';
import { useAppFetch } from '../../hooks/useAppFetch';
import { vi } from 'vitest';
import { AppError } from '../../types/AppError';
import { backendErrorsNames } from '../../utils/backendErrorsMap';
import {
  CSRF_TOKEN_COOKIE_NAME,
  UNKNOW_ERROR_MESSAGE,
} from '../../utils/constants';

const { getCSRFTokenMock, getCSRFMockFactory } = vi.hoisted(() => {
  const getCSRFTokenMock = vi.fn();
  const getCSRFMockFactory = () => ({
    getCSRFToken: getCSRFTokenMock,
  });

  return { getCSRFTokenMock, getCSRFMockFactory };
});

const { deleteUserMock, deleteUserMockFactory } = vi.hoisted(() => {
  const deleteUserMock = vi.fn();
  const deleteUserMockFactory = () => ({
    useAuthContext: () => ({
      deleteUser: deleteUserMock,
    }),
  });

  return { deleteUserMock, deleteUserMockFactory };
});

vi.mock('../../services/getCSRFToken', getCSRFMockFactory);
vi.mock('../../providers/auth/AuthContext', deleteUserMockFactory);

const mockFetch = vi.fn();
const originalFetch = global.fetch;
global.fetch = mockFetch;

describe('useAppFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    window[CSRF_TOKEN_COOKIE_NAME] = '';
  });

  it('returns successful response when fetch is OK', async () => {
    const mockResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });

    mockFetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAppFetch());
    const res = await result.current('/test', { method: 'GET' });

    expect(res).toBe(mockResponse);
  });

  it('should attach content type header if missing', async () => {
    const mockResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });

    mockFetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAppFetch());
    await result.current('/test', { method: 'GET' });
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      method: 'GET',
      headers,
      credentials: 'include',
    });
  });

  it('should attach CSRF token on state updating requests', async () => {
    window[CSRF_TOKEN_COOKIE_NAME] = 'test-token';
    const mockResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });

    mockFetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAppFetch());
    await result.current('/test', { method: 'POST' });
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('x-csrf-token', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      method: 'POST',
      headers,
      credentials: 'include',
    });
  });

  it('retries auth refresh once when UNAUTHENTICATED', async () => {
    const errorResponse = new Response(
      JSON.stringify({ message: backendErrorsNames.UNAUTHENTICATED }),
      { status: 401 },
    );
    const refreshResponse = new Response('{}', { status: 200 });
    const retrySuccess = new Response('{}', { status: 200 });

    mockFetch
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(refreshResponse)
      .mockResolvedValueOnce(retrySuccess);

    const { result } = renderHook(() => useAppFetch());
    const res = await result.current('/test', { method: 'POST' });

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenNthCalledWith(
      3,
      '/test',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(getCSRFTokenMock).toHaveBeenCalled();
    expect(res.ok).toBeTruthy();
  });

  it('deletes user if refresh token request fails', async () => {
    const errorResponse = new Response(
      JSON.stringify({ message: backendErrorsNames.UNAUTHENTICATED }),
      { status: 401 },
    );
    const refreshFail = new Response('{}', { status: 403 });

    mockFetch
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(refreshFail);

    const { result } = renderHook(() => useAppFetch());

    await expect(result.current('/test', { method: 'POST' })).rejects.toThrow(
      AppError,
    );

    expect(deleteUserMock).toHaveBeenCalled();
  });

  it('throws known AppError if backend error is mapped', async () => {
    const errorMessage = 'UNKNOWN_BACKEND_ERROR';
    const response = new Response(JSON.stringify({ message: errorMessage }), {
      status: 422,
    });

    mockFetch.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useAppFetch());

    try {
      await result.current('/fail', { method: 'POST' });
    } catch (error) {
      expect(error).toMatchObject({
        code: 422,
        message: UNKNOW_ERROR_MESSAGE,
      });
    }
  });

  it('throws generic AppError for unknown server error', async () => {
    const serverError = new Response('', { status: 500 });

    mockFetch.mockResolvedValueOnce(serverError);

    const { result } = renderHook(() => useAppFetch());

    try {
      await result.current('/fail', { method: 'GET' });
    } catch (error) {
      expect(error).toMatchObject({
        code: 500,
        message: UNKNOW_ERROR_MESSAGE,
      });
    }
  });

  it('throws AppError if fetch throws a network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failed'));

    const { result } = renderHook(() => useAppFetch());

    await expect(result.current('/fail', { method: 'GET' })).rejects.toThrow(
      AppError,
    );
  });
});
