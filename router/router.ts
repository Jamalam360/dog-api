import { Router } from "oak/mod.ts";
import { BASE_API_URL } from "/constants.ts";
import { allImages, lastRecacheTime, topLevelBreeds } from "/data/data.ts";
import { getRemainingRateLimit } from "/data/githubApi.ts";
import { getConfig } from "/config.ts";
import "/util/array.extension.ts";
import { requestNumber } from "/index.ts";

export const router = new Router();
const config = await getConfig();

router.get(BASE_API_URL + "/ping", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = "Pong!";
});

router.get(BASE_API_URL + "/statistics", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    breeds: {
      topLevelBreedsCount: topLevelBreeds.length,
      subBreedsCount: topLevelBreeds.map((breed) => breed.subBreeds).length,
    },
    images: {
      count: allImages.length,
      repository: config.imageRepository,
      recacheInterval: config.recacheInterval,
      lastRecacheTime: lastRecacheTime,
    },
    general: {
      endpointCount: router.routes.length,
      requestNumber: requestNumber,
    },
  };
});

router.get(BASE_API_URL + "/breeds/list/all", (ctx) => {
  //deno-lint-ignore no-explicit-any
  const breeds: { [k: string]: any } = {};

  for (const breed of topLevelBreeds) {
    breeds[breed.name] = breed.subBreeds.map((subBreed) => subBreed.name);
  }

  ctx.response.status = 200;
  ctx.response.body = {
    message: breeds,
    status: "success",
  };
});

router.get(BASE_API_URL + "/breed/:breed/images", (ctx) => {
  const breedName = ctx.params.breed;
  const breed = topLevelBreeds.find((breed) => breed.name === breedName);

  if (breed) {
    ctx.response.status = 200;
    ctx.response.body = {
      message: breed.images,
      status: "success",
    };
  }
});

router.get(BASE_API_URL + "/breed/:breed/images/random", (ctx) => {
  const breedName = ctx.params.breed;
  const breed = topLevelBreeds.find((breed) => breed.name === breedName);

  if (breed) {
    ctx.response.status = 200;
    ctx.response.body = {
      message: breed.images[Math.floor(Math.random() * breed.images.length)],
      status: "success",
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Breed not found (master breed does not exist)",
      code: 404,
      status: "error",
    };
  }
});

router.get(BASE_API_URL + "/breed/:breed/images/random/:number", (ctx) => {
  const breedName = ctx.params.breed;
  const breed = topLevelBreeds.find((breed) => breed.name === breedName);

  let number = parseInt(ctx.params.number);

  if (number > 50) {
    number = 50;
  }

  if (breed) {
    ctx.response.status = 200;
    ctx.response.body = {
      message: breed.images.randomElements(number),
      status: "success",
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Breed not found (master breed does not exist)",
      code: 404,
      status: "error",
    };
  }
});

router.get(BASE_API_URL + "/breed/:breed/list", (ctx) => {
  const breedName = ctx.params.breed;
  const breed = topLevelBreeds.find((breed) => breed.name === breedName);

  if (breed) {
    ctx.response.status = 200;
    ctx.response.body = {
      message: breed.subBreeds.map((subBreed) => subBreed.name),
      status: "success",
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Breed not found (master breed does not exist)",
      code: 404,
      status: "error",
    };
  }
});

router.get(BASE_API_URL + "/breed/:breed/:subbreed/images", (ctx) => {
  const breedName = ctx.params.breed;
  const subBreedName = ctx.params.subbreed;
  const breed = topLevelBreeds.find((breed) => breed.name === breedName);

  if (breed) {
    const subBreed = breed.subBreeds.find((subBreed) =>
      subBreed.name === subBreedName
    );

    if (subBreed) {
      ctx.response.status = 200;
      ctx.response.body = {
        message: subBreed.images,
        status: "success",
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "Breed not found (sub breed does not exist)",
        code: 404,
        status: "error",
      };
    }
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Breed not found (master breed does not exist)",
      code: 404,
      status: "error",
    };
  }
});

router.get(BASE_API_URL + "/breed/:breed/:subbreed/images/random", (ctx) => {
  const breedName = ctx.params.breed;
  const subBreedName = ctx.params.subbreed;
  const breed = topLevelBreeds.find((breed) => breed.name === breedName);

  if (breed) {
    const subBreed = breed.subBreeds.find((subBreed) =>
      subBreed.name === subBreedName
    );

    if (subBreed) {
      ctx.response.status = 200;
      ctx.response.body = {
        message: subBreed.images.randomElement(),
        status: "success",
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "Breed not found (sub breed does not exist)",
        code: 404,
        status: "error",
      };
    }
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Breed not found (master breed does not exist)",
      code: 404,
      status: "error",
    };
  }
});

router.get(
  BASE_API_URL + "/breed/:breed/:subbreed/images/random/:number",
  (ctx) => {
    const breedName = ctx.params.breed;
    const subBreedName = ctx.params.subbreed;
    const breed = topLevelBreeds.find((breed) => breed.name === breedName);

    let number = parseInt(ctx.params.number);

    if (number > 50) {
      number = 50;
    }

    if (breed) {
      const subBreed = breed.subBreeds.find((subBreed) =>
        subBreed.name === subBreedName
      );

      if (subBreed) {
        ctx.response.status = 200;
        ctx.response.body = {
          message: subBreed.images.randomElements(number),
          status: "success",
        };
      } else {
        ctx.response.status = 404;
        ctx.response.body = {
          message: "Breed not found (sub breed does not exist)",
          code: 404,
          status: "error",
        };
      }
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "Breed not found (master breed does not exist)",
        code: 404,
        status: "error",
      };
    }
  },
);

router.get(BASE_API_URL + "/breeds/image/random", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    message: allImages.randomElement(),
    status: "success",
  };
});

router.get(BASE_API_URL + "/breeds/image/random/:number", (ctx) => {
  let number = parseInt(ctx.params.number);

  if (number > 50) {
    number = 50;
  }

  ctx.response.status = 200;
  ctx.response.body = {
    message: allImages.randomElements(number),
    status: "success",
  };
});
