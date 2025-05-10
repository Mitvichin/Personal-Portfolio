import { vi } from 'vitest';
import { getCSRFToken } from '../../services/getCSRFToken';
import {
  CSRF_TOKEN_COOKIE_NAME,
  UNKNOW_ERROR_MESSAGE,
} from '../../utils/constants';
import { backendErrorsMap } from '../../utils/backendErrorsMap';

const mockFetch = vi.fn();
const originalFetch = global.fetch;
global.fetch = mockFetch;

describe('getCSRFToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window[CSRF_TOKEN_COOKIE_NAME] = '';
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('should set CSRF token on success', async () => {
    const fakeCSRFToken = 'csrf_token_123';
    const fakeResponse = new Response(
      JSON.stringify({ csrfToken: fakeCSRFToken }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );

    mockFetch.mockResolvedValueOnce(fakeResponse);

    await getCSRFToken();

    expect(window[CSRF_TOKEN_COOKIE_NAME]).toBe(fakeCSRFToken);
  });

  it('should throw AppError with 403 message on CSRF_INVALID_TOKEN', async () => {
    const fakeResponse = new Response(
      JSON.stringify({ message: backendErrorsMap.CSRF_INVALID_TOKEN }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );

    mockFetch.mockResolvedValueOnce(fakeResponse);

    try {
      await getCSRFToken();
    } catch (error) {
      expect(error).toMatchObject({
        code: 403,
        message: backendErrorsMap.CSRF_INVALID_TOKEN(),
      });
    }
  });

  it('should throw AppError with unknown message on non-403 errors', async () => {
    const fakeResponse = new Response(
      JSON.stringify({ message: 'Some error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );

    mockFetch.mockResolvedValueOnce(fakeResponse);

    try {
      await getCSRFToken();
    } catch (error) {
      expect(error).toMatchObject({
        code: 500,
        message: UNKNOW_ERROR_MESSAGE,
      });
    }
  });

  it('should throw AppError with generic error on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    try {
      await getCSRFToken();
    } catch (error) {
      expect(error).toMatchObject({
        code: 500,
        message: UNKNOW_ERROR_MESSAGE,
      });
    }
  });
});
