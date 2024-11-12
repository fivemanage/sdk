import { setHttpCallback } from "@citizenfx/http-wrapper";

import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";

const authMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const authHeader = ctx.request.headers.authorization;
  if (authHeader === globalThis.sdkToken) {
    await next();
  } else {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
  }
};

export async function startHttpFeature() {
  const app = new Koa();
  const router = new Router();

  router.get("/health", async (ctx) => {
    ctx.body = { ok: true };
  });

  app
    .use(authMiddleware)
    .use(
      koaBody({
        patchKoa: true,
        multipart: true,
        json: true,
      })
    )
    .use(router.routes())
    .use(router.allowedMethods());

  setHttpCallback(app.callback());
}
