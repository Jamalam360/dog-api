import { Breed } from "/data/types.ts";
import { getConfig } from "/config.ts";
import {
  getImageUrlsFromDir,
  getRateLimitResetTime,
  getSubDirectories,
  isRateLimited,
} from "/data/githubApi.ts";

export let topLevelBreeds: Breed[] = [];
export let allImages: string[] = [];
const config = await getConfig();

export async function updateData() {
  if (!(await isRateLimited()) && false) {
    const topLevelBreedDirectories = await getSubDirectories("");

    for (const topLevelBreedDirectory of topLevelBreedDirectories) {
      topLevelBreeds.push(await createBreed(topLevelBreedDirectory));
    }

    await cacheData(topLevelBreeds);
  } else {
    console.log(
      "Github API rate limited. Skipping update. Rate limit will reset at: " +
        await getRateLimitResetTime(),
    );

    topLevelBreeds = await readCachedData();
  }

  populateImages();
}

function populateImages() {
  allImages = [];

  for (const breed of topLevelBreeds) {
    for (const subBreed of breed.subBreeds) {
      for (const image of subBreed.images) {
        allImages.push(image);
      }
    }

    for (const image of breed.images) {
      allImages.push(image);
    }
  }
}

async function cacheData(dat: Breed[]) {
  await Deno.writeTextFile(config.cacheFile, JSON.stringify(dat, null, 2));
}

async function readCachedData(): Promise<Breed[]> {
  const data = await Deno.readTextFile(config.cacheFile);
  const json = JSON.parse(data);
  const breeds: Breed[] = [];

  for (const breed of json) {
    breeds.push(breed);
  }

  return breeds;
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
