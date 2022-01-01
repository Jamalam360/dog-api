import { Router } from "oak/mod.ts";
import { BASE_API_URL } from "/constants.ts";

const router = new Router();

router.get(BASE_API_URL + "/breeds/list/all", (ctx) => {
});
