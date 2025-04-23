import { useAppFetch } from "../hooks/useAppFetch";
import { GetFileContentResponse } from "../types/api/responses";
import { BASE_API_ULR } from "../utils/constants";

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
      `${BASE_API_ULR}/github/get-file-content?${params.toString()}`,
      {
        method: "GET",
      }
    );

    return res.json();
  };

  return { getFileContent };
};
