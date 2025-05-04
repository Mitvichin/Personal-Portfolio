import {
  BASE_API_ULR,
  CSRF_TOKEN_COOKIE_NAME,
  UNKNOW_ERROR_MESSAGE,
} from '../utils/constants';
import { AppError } from '../types/AppError';
import { backendErrorsMap } from '../utils/backendErrorsMap';

export const getCSRFToken = async (): Promise<void> => {
  try {
    const res = await fetch(`${BASE_API_ULR}/auth/csrf-token`, {
      method: 'GET',
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new AppError(403, backendErrorsMap.CSRF_INVALID_TOKEN());
      }

      throw new AppError(res.status, UNKNOW_ERROR_MESSAGE);
    }

    const { csrfToken }: { csrfToken: string } = await res.json();
    window[CSRF_TOKEN_COOKIE_NAME] = csrfToken;
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;

    throw new AppError(500, UNKNOW_ERROR_MESSAGE);
  }
};
