import { useCallback } from 'react';
import { BackendError } from '../types/api/BackendError';
import {
  backendErrorsMap,
  backendErrorsNames,
} from '../utils/backendErrorsMap';
import { useAuthContext } from '../providers/auth/AuthContext';
import { AppError } from '../types/AppError';
import { csrfProtectedMethods } from '../config';
import {
  BASE_API_ULR,
  CSRF_TOKEN_COOKIE_NAME,
  UNKNOW_ERROR_MESSAGE,
} from '../utils/constants';
import { getCSRFToken } from '../services/getCSRFToken';

export const useAppFetch = () => {
  const { deleteUser } = useAuthContext();
  const appFetch = useCallback(
    async (
      url: string,
      init: RequestInit,
      hasRetried = false,
    ): Promise<Response> => {
      const headers = new Headers(init?.headers);

      if (!headers?.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      if (csrfProtectedMethods[init.method || '']) {
        headers.set('x-csrf-token', window[CSRF_TOKEN_COOKIE_NAME] || '');
      }

      try {
        const res = await fetch(url, {
          ...init,
          headers,
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status >= 400 && res.status <= 499) {
            const error: BackendError = await res.json();

            if (error.message === backendErrorsNames.UNAUTHENTICATED) {
              if (!hasRetried) {
                const retry = await fetch(`${BASE_API_ULR}/auth/refresh`);

                if (!retry.ok) {
                  deleteUser();

                  throw new AppError(
                    res.status,
                    backendErrorsMap.UNAUTHENTICATED(),
                  );
                } else {
                  await getCSRFToken();
                }

                return appFetch(url, init, true);
              }

              deleteUser();
            }

            throw new AppError(
              res.status,
              backendErrorsMap[error.message]?.(error.key),
            );
          }

          throw new AppError(res.status, UNKNOW_ERROR_MESSAGE);
        }

        return res;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }

        throw new AppError(500, UNKNOW_ERROR_MESSAGE);
      }
    },
    [deleteUser],
  );

  return appFetch;
};
