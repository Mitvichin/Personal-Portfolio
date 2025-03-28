import { BackendError } from "../types/api/BackendError";
import { backendErrorsMap } from "./backendErrorsMap";

export const appFetch = async (
  url: string,
  init: RequestInit
): Promise<Response> => {
  const headers = new Headers(init?.headers);

  if (!headers?.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, { ...init, headers });

    if (!res.ok) {
      if (res.status >= 400 && res.status <= 499) {
        const error: BackendError = await res.json();
        if (error.message) {
          throw new Error(backendErrorsMap[error.message]?.(error.key));
        }
      }

      throw new Error("Something went wrong! Try again later!");
    }

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong! Please try again lager!");
  }
};
