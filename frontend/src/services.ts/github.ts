import { GithubSearchResponse } from "../types/api/responses";

export const downloadRepoFile = async (
  searchWord: string,
  fileName: string
) => {
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

    const targetFile = data.items.find((it) => it.name === fileName + ".tsx");

    if (!targetFile) throw new Error("404");

    const fileUrl = targetFile?.url;
    const fileResponse = await fetch(fileUrl, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    });

    return await fileResponse.text();
  } catch {
    throw new Error("404 file not found");
  }
};
