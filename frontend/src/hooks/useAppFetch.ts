import { useCallback } from 'react';
import { BackendError } from '../types/api/BackendError';
import {
  backendErrorsMap,
  backendErrorsNames,
} from '../utils/backendErrorsMap';
import { useAuthContext } from '../providers/auth/AuthContext';
import { AppError } from '../types/AppError';
import { csrfProtectedMethods } from '../config';
import { BASE_API_ULR } from '../utils/constants';

export const useAppFetch = () => {
  const { deleteUser, csrfToken } = useAuthContext();
  const unknownErrorMsg = 'Something went wrong! Try again later!';

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
            const error: BackendError = await res.json() ;

            if (error.message === backendErrorsNames.UNAUTHENTICATED) {
              if (!hasRetried) {
                const retry = await fetch(`${BASE_API_ULR}/auth/refresh`);

                if (!retry.ok) {
                  deleteUser();

                  throw new AppError(
                    res.status,
                    backendErrorsMap.UNAUTHENTICATED(),
                  );
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
