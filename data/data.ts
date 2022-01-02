import { Breed } from "/data/types.ts";
import { getConfig } from "/config.ts";
import {
  getImageUrlsFromDir,
  getRateLimitResetTime,
  getRemainingRateLimit,
  getSubDirectories,
  isRateLimited,
} from "/data/githubApi.ts";

export let topLevelBreeds: Breed[] = [];
export let allImages: string[] = [];
export let lastRecacheTime: Date;
const config = await getConfig();

export async function updateData() {
  topLevelBreeds = [];

  if (!(await isRateLimited())) {
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

  console.log(
    "Finished updating data. " + allImages.length + " images found. " +
      await getRemainingRateLimit() + " requests remaining before rate limit.",
  );

  lastRecacheTime = new Date();
}

function populateImages() {
  allImages = [];

  topLevelBreeds.forEach((breed) => {
    breed.images.forEach((image) => allImages.push(image));
    breed.subBreeds.forEach((subBreed) =>
      subBreed.images.forEach((image) => allImages.push(image))
    );
  });
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
    subBreeds.push(await createBreed(subDir));
  }

  return {
    name: name,
    subBreeds: subBreeds,
    images: breedImages,
  };
}
