import type { Context } from "$lib/trpc/context";
// import { initTRPC } from "@trpc/server";
import { sleep } from "$lib/utils";
import { t } from "$lib/trpc/t";
import middleware from "$lib/trpc/middleware";
import { protectedProcedure } from "$lib/trpc/middleware";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { APIFY_TOKEN } from "$env/static/private";
import { ApifyClient } from "apify-client";
import type { BottlesDBResponse } from "$lib/WineTypes";
import { keyCode } from "$lib/WineTypes";
import { json } from "@sveltejs/kit";
import { testMatchRoute } from "./routes/testMatchRoute";
import { p, pt } from "$lib/utils";
import { pbCollection } from "$lib/trpc/routes/pbCollection";
// export const t = initTRPC.context<Context>().create();
const { auth, logger, admin } = middleware;

// const publicProcedure = t.procedure;

// const protectedProcedure = publicProcedure.use(auth);

export const router = t.router({
  greeting: protectedProcedure
    .use(logger)
    .use(admin)
    .query(async ({ ctx: { userId } }) => {
      await sleep(500); // 👈 simulate an expensive operation
      return `Hello,${userId}. tRPC v10 @ ${new Date().toLocaleTimeString()}`;
    }),
  testMatchRoute: testMatchRoute,
  pbCollection: pbCollection,
});

export const { createCallerFactory } = t;

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
