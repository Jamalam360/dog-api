import { Application } from "oak";
import { oakCors } from "cors";
import { cyan, yellow } from "colors";
import { cron } from "cron";
import { PORT, CERTIFICATE_PATH, PRIVATE_KEY_PATH } from "constants"

const app = new Application();

let development = false;

//cron(`1 */30 * * * *`, () => tryRecache());

await Deno.readTextFile(CERTIFICATE_PATH).catch(() => {
  console.log(
    yellow(
      "Certificate file not found; this should only occur in a development environment",
    ),
  );
  development = true;
});

// router.forEach((entry) => {
//   console.log(cyan("Registered Path: " + entry.path));
// });

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    cyan(ctx.request.method + " " + ctx.request.url + " - " + rt),
  );
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", ms + "ms");
});

app.addEventListener("listen", () => {
  console.log(cyan("Listening on port " + PORT));
});

if (!development) {
  console.log(cyan("Using production environment settings"));

  app.use(
    oakCors({
      origin: "https://dog.jamalam.tech",
    }),
  );

//   app.use(router.allowedMethods());
//   app.use(router.routes());

  await app.listen({
    port: PORT,
    secure: true,
    certFile: CERTIFICATE_PATH,
    keyFile: PRIVATE_KEY_PATH,
  });
} else {
  console.log(yellow("Using development environment settings"));

//   app.use(router.allowedMethods());
//   app.use(router.routes());

  await app.listen({
    port: PORT,
  });
}