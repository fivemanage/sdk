import { setHttpCallback } from "@citizenfx/http-wrapper";
import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";
import { z } from "zod";
import type { ActionSchema } from "~/actions/server/main";

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
    const actions = Object.entries(globalThis.actions).map(([id, action]) => ({
      id,
      name: action.name,
      description: action.description,
      inputSchema: action.inputSchema,
    }));

    ctx.body = actions;
  });

  router.post("/actions/:id", async (ctx) => {
    const inputs = ctx.request.body;
    const actionId = ctx.params.id;

    if (!actionId) {
      ctx.status = 400;
      ctx.body = { error: "Action ID is required" };
      return;
    }

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
      schema: z.infer<typeof ActionSchema>["inputSchema"]
    ) => {
      const inputSchema = z.object(
        schema.reduce((acc, field) => {
          const fieldSchema = (() => {
            switch (field.type) {
              case "string":
              case "textarea":
                return z.string();
              case "number":
              case "slider":
                return z.number();
              case "boolean":
                return z.boolean();
              case "date":
                return z.string();
              case "daterange":
                return z.object({ from: z.string(), to: z.string() });
              case "select":
                return z.enum(field.options as [string, ...Array<string>]);
              default:
                return z.any();
            }
          })();

          acc[field.name] = field.required
            ? fieldSchema
            : fieldSchema.optional();
          return acc;
        }, {} as Record<string, z.ZodTypeAny>)
      );

      return inputSchema.safeParse(inputs);
    };

    const validation = validateInputs(inputs, action.inputSchema);

    if (!validation.success) {
      ctx.status = 400;
      ctx.body = {
        error: `Invalid inputs\n\n${JSON.stringify(validation.error.errors)}`,
      };
      return;
    }

    try {
      const result = action.fn(validation.data);
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
