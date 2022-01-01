import { Application } from "oak/mod.ts";
import { oakCors } from "cors";
import { cron } from "cron";
import { info } from "/util/fmt.ts";
import { getConfig } from "/config.ts";
import { updateData } from "/data/data.ts";
import { router } from "/router/router.ts";

const app = new Application();
const config = await getConfig();

await updateData();
cron(config.recacheInterval, async () => await updateData());

router.forEach((entry) => {
  console.log(info("Registered Path: " + entry.path));
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    info(ctx.request.method + " " + ctx.request.url + " - " + rt),
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
  console.log(info("Listening on port " + config.port));
});

if (config.https.secure) {
  app.use(
    oakCors({
      origin: "*",
    }),
  );

  app.use(router.allowedMethods());
  app.use(router.routes());

  await app.listen({
    port: config.port,
    secure: true,
    certFile: config.https.certFile!,
    keyFile: config.https.keyFile!,
  });
} else {
  app.use(router.allowedMethods());
  app.use(router.routes());

  await app.listen({
    port: config.port,
  });
}
