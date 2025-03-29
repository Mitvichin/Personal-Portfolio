import { useMemo } from "react";
import { BackendError } from "../types/api/BackendError";
import {
  backendErrorsMap,
  backendErrorsNames,
} from "../utils/backendErrorsMap";
import { useUserContext } from "../providers/user/UserContext";
import { AppError } from "../types/AppError";

export const useAppFetch = () => {
  const { deleteUser } = useUserContext();

  const appFetch = useMemo(
    () =>
      async (url: string, init: RequestInit): Promise<Response> => {
        const headers = new Headers(init?.headers);

        if (!headers?.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }

        try {
          const res = await fetch(url, { ...init, headers });
          if (!res.ok) {
            if (res.status >= 400 && res.status <= 499) {
              const error: BackendError = await res.json();

              if (error.message === backendErrorsNames.UNAUTHENTICATED) {
                deleteUser();
              }

              throw new AppError(
                res.status,
                backendErrorsMap[error.message]?.(error.key)
              );
            }

            throw new AppError(
              res.status,
              "Something went wrong! Try again later!"
            );
          }

          return res;
        } catch (error) {
          if (error instanceof AppError) {
            throw error;
          }

          throw new AppError(500, "Something went wrong! Try again later!");
        }
      },
    [deleteUser]
  );

  return appFetch;
};
