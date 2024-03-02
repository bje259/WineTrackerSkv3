import type { PageServerLoad } from "./$types.d.ts";
import { OPENAI_API_KEY, NEO4J_PASSWORD } from "$env/static/private";
import { OpenAIEmbeddings } from "@langchain/openai";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
import { createContext } from "$lib/trpc/context";
import { router, createCallerFactory } from "$lib/trpc/router";
import { json } from "@sveltejs/kit";
import { p, pt, PO } from "$lib/utils";
export const load = (async (event) => {
  const { locals, cookies } = event;
  const log = locals.log || new PO();
  if (!locals.pb.authStore.isValid) {
    console.log("Not logged in");
    const message = {
      type: "error",
      message: "You must be logged in to access this page",
    } as const;
    throw redirect(303, "/login", message, cookies);
  }

  const documents = [
    { pageContent: "what's this", metadata: { a: 2 } },
    { pageContent: "Cat drinks milk", metadata: { a: 1 } },
  ];

  const createCaller = createCallerFactory(router);
  const routes = Object.keys(router);
  const routerMap = new Map(Object.entries(router).map(([k, v]) => [k, v]));
  log.p("routes: ", routes.slice(0, 5));
  log.p("routerMap: ", Array.from(routerMap.entries()).slice(0, 5));
  const trpcresp = {
    greeting: await createCaller(await createContext(event)).greeting(),
    testMatchRoute: await createCaller(
      await createContext(event)
    ).testMatchRoute(),
  };
  log.p(
    "test match route: ",
    createCaller(await createContext(event)).testMatchRoute
  );
  // p("test match route: ", trpcresp.testMatchRoute);
  // p("jsontestmatch: ", trpcresp.testMatchRoute);
  return {
    documents,
    greeting: trpcresp.greeting,
    testMatchRoute: trpcresp.testMatchRoute,
    routes: routes,
  };
}) satisfies PageServerLoad;
