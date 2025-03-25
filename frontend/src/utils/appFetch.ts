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
      if (res.status === 400) {
        throw new Error("Invalid input!");
      }

      if (res.status === 429) {
        throw new Error("You have send too many requests. Try again later!");
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
