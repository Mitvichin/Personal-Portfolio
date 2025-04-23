import { useAppFetch } from "../hooks/useAppFetch";
import { GetFileContentResponse } from "../types/api/responses";

export const useGithubService = () => {
  const appFetch = useAppFetch();

  const getFileContent = async (data: {
    searchWord: string;
    filePath: string;
  }): Promise<GetFileContentResponse> => {
    const { searchWord, filePath } = data;
    const params = new URLSearchParams({
      searchWord,
      filePath,
    });

    const res = await appFetch(
      `/api/github/get-file-content?${params.toString()}`,
      {
        method: "GET",
      }
    );
    return res.json();
  };

  return { getFileContent };
};
