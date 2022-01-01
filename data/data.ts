import { Breed } from "/data/types.ts";
import { getConfig } from "/config.ts";
import {
  getImageUrlsFromDir,
  getRateLimitResetTime,
  getSubDirectories,
  isRateLimited,
} from "/data/githubApi.ts";

const topLevelBreeds: Breed[] = [];
const config = await getConfig();

export async function updateData() {
  if (!(await isRateLimited())) {
    const topLevelBreedDirectories = await getSubDirectories("");

    for (const topLevelBreedDirectory of topLevelBreedDirectories) {
      topLevelBreeds.push(await createBreed(topLevelBreedDirectory));
      console.log(
        "Created Breed: " + topLevelBreeds[topLevelBreeds.length - 1].name,
      );
    }
  } else {
    console.log(
      "Github API rate limited. Skipping update. Rate limit will reset at: " +
        await getRateLimitResetTime(),
    );
  }
}

async function createBreed(directory: string): Promise<Breed> {
  const directorySplit = directory.split("/");
  const name = directorySplit[directorySplit.length - 1];
  const breedImages = await getImageUrlsFromDir(directory, false);
  const subBreeds: Breed[] = [];

  const subDirs = await getSubDirectories(directory);

  for (const subDir of subDirs) {
    console.log(subDir);
    subBreeds.push(await createBreed(subDir));
  }

  return {
    name: name,
    subBreeds: subBreeds,
    images: breedImages,
  };
}
