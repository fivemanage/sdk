import { setHttpCallback } from "@citizenfx/http-wrapper";

import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";
import type { ActionInput } from "~/actions/server/main";

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

  router.get("/actions", async (ctx) => {
    const actions = Object.keys(globalThis.actions).map((action) => {
      return {
        id: action,
        name: globalThis.actions[action]?.name,
        description: globalThis.actions[action]?.description,
        inputSchema: globalThis.actions[action]?.inputSchema,
      };
    });

    ctx.body = actions;
  });

  router.post("/actions/:id", async (ctx) => {
    const inputs = ctx.request.body;
    const actionId = ctx.params.id;

    if (!actionId) return;

    const action = globalThis.actions[actionId];

    if (!action) {
      ctx.status = 404;
      ctx.body = { error: "Action not found" };
      return;
    }

    if (!inputs) {
      ctx.status = 400;
      ctx.body = { error: "No inputs provided" };
      return;
    }

    const validateInputs = (
      inputs: Record<string, unknown>,
      schema: Array<ActionInput>
    ) => {
      for (const field of schema) {
        if (field.required && !(field.name in inputs)) {
          return {
            valid: false,
            error: `Missing required field: ${field.name}`,
          };
        }
        // biome-ignore lint/suspicious/useValidTypeof: <explanation>
        if (field.name in inputs && typeof inputs[field.name] !== field.type) {
          return {
            valid: false,
            error: `Invalid type for field: ${field.name}`,
          };
        }
      }
      return { valid: true };
    };

    const validation = validateInputs(inputs, action.inputSchema);

    if (!validation.valid) {
      ctx.status = 400;
      ctx.body = { error: validation.error };
      return;
    }

    try {
      const result = action.fn(inputs);
      ctx.body = { success: true, result };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
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
