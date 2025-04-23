import { useMemo } from 'react';
import { BackendError } from '../types/api/BackendError';
import {
  backendErrorsMap,
  backendErrorsNames,
} from '../utils/backendErrorsMap';
import { useAuthContext } from '../providers/auth/AuthContext';
import { AppError } from '../types/AppError';
import { csrfProtectedMethods } from '../config';

export const useAppFetch = () => {
  const { deleteUser, csrfToken } = useAuthContext();
  const unknownErrorMsg = 'Something went wrong! Try again later!';

  const appFetch = useMemo(
    () =>
      async (url: string, init: RequestInit): Promise<Response> => {
        const headers = new Headers(init?.headers);

        if (!headers?.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }

        if (csrfProtectedMethods[init.method || '']) {
          headers.set('x-csrf-token', csrfToken);
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
                deleteUser();
              }

              throw new AppError(
                res.status,
                backendErrorsMap[error.message]?.(error.key),
              );
            }

            throw new AppError(res.status, unknownErrorMsg);
          }

          return res;
        } catch (error) {
          if (error instanceof AppError) {
            throw error;
          }

          throw new AppError(500, unknownErrorMsg);
        }
      },
    [csrfToken, deleteUser],
  );

  return appFetch;
};
