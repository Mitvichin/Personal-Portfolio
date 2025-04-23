import { GetFileContentResponse } from "./api/responses";

export type GetGithubFileContent = ({
  searchWord,
  filePath,
}: {
  searchWord: string;
  filePath: string;
}) => Promise<GetFileContentResponse>;
