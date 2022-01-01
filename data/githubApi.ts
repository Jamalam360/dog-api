import { getConfig } from "/config.ts";
import { yellow } from "colors";

const CONTENTS_URL =
  "https://api.github.com/repos/dog-jamalam-tech/images/contents";
const config = await getConfig();

export async function isRateLimited(): Promise<boolean> {
  const res = await fetch(CONTENTS_URL, {
    headers: {
      Authorization: "token " + config.githubToken,
    },
  });

  console.log(yellow("API Request:") + " Check Rate Limit");

  return res.headers.get("X-RateLimit-Remaining") == "0";
}

export async function getRateLimitResetTime(): Promise<string> {
  const res = await fetch(CONTENTS_URL, {
    headers: {
      Authorization: "token " + config.githubToken,
    },
  });

  console.log(yellow("API Request:") + " Get Rate Limit Reset Time");

  return new Date(parseInt(res.headers.get("X-RateLimit-Reset")!) * 1000)
    .toString();
}

export async function getSubDirectories(
  parentDir: string,
): Promise<string[]> {
  const res = await fetch(CONTENTS_URL + "/" + parentDir, {
    headers: {
      "Authorization": "token " + config.githubToken,
    },
  });
  const contents = await res.json();
  const subdirectories: string[] = [];

  console.log(yellow("API Request:") + " Get Subdirectories of " + parentDir);

  for (const content of contents) {
    if (content.type == "dir") {
      subdirectories.push(content.path);
    }
  }

  return subdirectories;
}

export async function getImageUrlsFromDir(
  dir: string,
  includeSubDirectories = false,
): Promise<string[]> {
  const res = await fetch(CONTENTS_URL + "/" + dir, {
    headers: {
      "Authorization": "token " + config.githubToken,
    },
  });
  const contents = await res.json();

  const images: string[] = [];

  console.log(yellow("API Request:") + " Get Images in Directory " + dir);

  for (const content of contents) {
    if (content.type == "dir" && includeSubDirectories) {
      images.concat(
        await getImageUrlsFromDir(content.path, includeSubDirectories),
      );
    } else if (content.type == "file") {
      if (content.name.includes(".jpg" || ".png" || ".jpeg")) {
        images.push(content.download_url);
      }
    }
  }

  return images;
}
