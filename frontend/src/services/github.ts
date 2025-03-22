import { GithubSearchResponse } from "../types/api/responses";
import { GithubFile } from "../types/GithubFile";

const ROOT_FOLDER_NAME = "frontend";

export const downloadRepoFile = async (
  searchWord: string,
  filePath: string
): Promise<GithubFile> => {
  const query = `${encodeURIComponent(
    `"${searchWord}" repo:Mitvichin/Personal-Portfolio`
  )} `;

  try {
    const response = await fetch(
      `https://api.github.com/search/code?q=${query}&type=text`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.text-match+json",
        },
      }
    );

    const data: GithubSearchResponse = await response.json();

    const targetFile = data.items.find(
      (it) => it.path === ROOT_FOLDER_NAME + filePath
    );

    if (!targetFile) throw new Error("404");

    const fileUrl = targetFile?.url;
    const fileResponse = await fetch(fileUrl, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    });

    const content = await fileResponse.text();

    return { content, url: targetFile.html_url };
  } catch {
    throw new Error("404 file not found");
  }
};
