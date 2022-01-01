import { Router } from "oak/mod.ts";
import { BASE_API_URL } from "/constants.ts";
import { allImages, topLevelBreeds } from "/data/data.ts";

export const router = new Router();

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
  const images = [];

  if (number > 50) {
    number = 50;
  }

  if (breed) {
    for (let i = 0; i < number; i++) {
      images.push(
        breed.images[Math.floor(Math.random() * breed.images.length)],
      );
    }

    ctx.response.status = 200;
    ctx.response.body = {
      message: images,
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
        message:
          subBreed.images[Math.floor(Math.random() * subBreed.images.length)],
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
    const images = [];

    if (number > 50) {
      number = 50;
    }

    if (breed) {
      const subBreed = breed.subBreeds.find((subBreed) =>
        subBreed.name === subBreedName
      );

      if (subBreed) {
        for (let i = 0; i < number; i++) {
          images.push(
            subBreed.images[Math.floor(Math.random() * subBreed.images.length)],
          );
        }

        ctx.response.status = 200;
        ctx.response.body = {
          message: images,
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
    message: allImages[Math.floor(Math.random() * allImages.length)],
    status: "success",
  };
});

router.get(BASE_API_URL + "/breeds/image/random/:number", (ctx) => {
  let number = parseInt(ctx.params.number);
  const images = [];

  if (number > 50) {
    number = 50;
  }

  for (let i = 0; i < number; i++) {
    images.push(allImages[Math.floor(Math.random() * allImages.length)]);
  }

  ctx.response.status = 200;
  ctx.response.body = {
    message: images,
    status: "success",
  };
});
