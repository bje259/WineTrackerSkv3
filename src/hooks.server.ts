// src/hooks.server.ts
import PocketBase from "pocketbase";
import type { Handle } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import type { UserDB as User, Admin } from "$lib/types";
import { PUBLIC_PB_HOST } from "$env/static/public";
import { ADMIN_USER_ID } from "$env/static/private";
import type {
  TypedPocketBase,
  UsersResponse,
  UsersRecord,
} from "$lib/WineTypes";
import { UsersRecordSchema } from "$lib/WineTypes";
import { Collections } from "$lib/WineTypes";
import { sequence } from "@sveltejs/kit/hooks";
import { createContext, createReqContext } from "$lib/trpc/context";
import { router, createCallerFactory } from "$lib/trpc/router";
import { createTRPCHandle } from "trpc-sveltekit";
import type { RequestEvent } from "@sveltejs/kit";
import { resolveHTTPResponse } from "@trpc/server/http";
import type { inferRouterContext } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import type {
  Maybe,
  MaybePromise,
  inferRouterError,
  ProcedureType,
} from "@trpc/server";
import type * as trpctypes from "./trpctypes.d.ts";
import type { ResolveHTTPResponseOptions } from "./trpctypes.d.ts";
import { PO } from "$lib/utils";
// import type { BaseContentTypeHandler } from '@trpc/server/http/contentType';
// import type { HTTPResponse, ResponseChunk } from '@trpc/server';
// import type { HTTPBaseHandlerOptions, HTTPRequest } from '@trpc/server';

const allowedHeaders = ["retry-after", "content-type"];

const po = new PO(false);

/** @type {import('@sveltejs/kit').Handle} */
const first: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(PUBLIC_PB_HOST) as TypedPocketBase;
  event.locals.log = po;

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );
  // po.p(
  //   "hooks received cookie",
  //   event.request.headers.get("cookie") || ""
  // );

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (
      event.locals.pb.authStore.isAdmin &&
      event.locals.pb.authStore.isValid
    ) {
      await event.locals.pb.admins.authRefresh();
    } else if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection("users").authRefresh();
    }
  } catch (_) {
    // clear the auth store on failed refresh
    // po.p("auth refresh failed");
    event.locals.pb.authStore.clear();
  }

  if (event.locals.pb.authStore.isAdmin) {
    event.locals.admin = serializeNonPOJOs<Admin>(
      event.locals.pb.authStore.model as Admin
    );
    // const tempUser = await event.locals.pb
    //   .collection("users")
    //   .getOne<User>(ADMIN_USER_ID);
    const tempUser = await event.locals.pb
      .collection(Collections.Users)
      .getOne<UsersResponse>(ADMIN_USER_ID);
    const parsedUser = UsersRecordSchema.parse(tempUser);
    event.locals.user = serializeNonPOJOs<UsersRecord>(parsedUser);
  } else if (
    event.locals.pb.authStore.isValid &&
    event.locals.pb.authStore.model
  ) {
    const parsedUser = UsersRecordSchema.parse(event.locals.pb.authStore.model);
    event.locals.user = serializeNonPOJOs<UsersRecord>(
      parsedUser as UsersRecord
    );
  } else {
    // po.p("hooks clearing user");
    event.locals.user = undefined;
  }

  const response = await resolve(event);
	//test
  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie()
  );

  return response;
};

// responseMeta: (opts: {
//         data: TRPCResponse<unknown, inferRouterError<Router>>[];
//         ctx?: inferRouterContext<Router>;
//         paths?: string[];
//         type: ProcedureType;
//         errors: TRPCError[];
//     }) => ResponseMeta;

type CreateTRPCHandleFunction = typeof createTRPCHandle;
type CreateTRPCHandleArg = Parameters<typeof createTRPCHandle>[0]; // Get the first argument of createTRPCHandle

// Now, extract the type of `responseMeta` from this argument
type ResponseMetaFunction = CreateTRPCHandleArg["responseMeta"];
type AnyRouter = CreateTRPCHandleArg["router"];
type ValidRoute = CreateTRPCHandleArg["url"];
// type OnErrorFunction = CreateTRPCHandleArg["onError"];

const responseMeta: ResponseMetaFunction = (opts) => {
  const { ctx, errors, type, data, paths } = opts;
  const pb = ctx?.locals?.pb;
  const log = ctx?.locals?.log || po;
  log.p(pb);
  return {
    headers: {
      "set-cookie": ctx.pb.authStore.exportToCookie(),
    },
  };
};

const second: Handle = createTRPCHandle({
  router,
  createContext: createReqContext,
  responseMeta,
});

const third: Handle = async ({ event, resolve }) => {
  try {
    event.locals.log = po;
    const locals = await createContext(event);
    po.p("Hooks Locals", locals);
    event.locals = locals;
    const TRPC = createTRPCHandle({
      router,
      createContext: createReqContext,
      responseMeta,
    });
    // const TRPC = createCustomTRPCHandle({
    //   router,
    //   createContext: createReqContext,
    //   responseMeta,
    //   onError: (error) => {
    //     po.p(error);
    //     return error;
    //   },
    // });
    const response = await TRPC({ event, resolve });
    // event = await handleHeaders(event);
    // const response = await resolve(event);
    // const createCaller = createCallerFactory(router);
    // event.locals = locals;
    if (locals.pb) {
      // Assuming result is an HTTP response, append the updated cookie
      response.headers.append(
        "set-cookie",
        locals.pb.authStore.exportToCookie()
      );
    }
    return response;
  } catch (error) {
    po.p(error);
    return resolve(event);
  }
};

export const handle = sequence(third);

// type resolveHTTPResponseFunction = typeof resolveHTTPResponse<TRouter extends AnyRouter, TRequest extends HTTPRequest>(opts: Omit<ResolveHTTPRequestOptions<TRouter, TRequest>, 'unstable_onChunk' | 'unstable_onHead'>): Promise<HTTPResponse>;

const handleHeaders = async (event: RequestEvent): Promise<RequestEvent> => {
  const request = event.request;
  const req = {
    method: request.method,
    headers: request.headers,
    query: event.url.searchParams,
    body: await request.text(),
  };
  // Using the default `event.setHeaders` and `event.cookies` will not work
  // as the event in not resolved by SvelteKit. Instead, we "proxy" the access
  // to the headers.
  const originalSetHeaders = event.setHeaders;
  const headersProxy: Record<string, string> = {};
  event.setHeaders = (headers) => {
    for (const [key, value] of Object.entries(headers)) {
      headersProxy[key] = value;
    }
    // Still call the original `event.setHeaders` function, as it may be used in SvelteKit internals.
    originalSetHeaders(headers);
  };
  // const httpResponse = await resolveHTTPResponse({
  //   router,
  //   req,
  //   path: event.url.pathname.substring(url.length + 1),
  //   createContext: async () => createContext?.(event),
  //   responseMeta,
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   onError: onError,
  // });
  // const { status, headers, body } = httpResponse;
  // // Set headers and cookies that were set using SvelteKit's `event.setHeaders` and `event.cookies.set`.
  // for (const [key, value] of Object.entries(headersProxy)) {
  //   headers[key] = value;
  // }
  // // Current cookies from TRPC
  // const currentCookiesHeaders =
  //   headers["Set-Cookie"]?.split("; ").map((cookie) => {
  //     const name = cookie.split("=")[0];
  //     const value = cookie.split("=").at(1);
  //     return { name, value };
  //   }) ?? [];
  // // Add / Replace cookies from SvelteKit
  // for (const cookie of event.cookies.getAll()) {
  //   // Remove existing cookie
  //   const existingCookieIndex = currentCookiesHeaders.findIndex(
  //     (c) => c.name === cookie.name
  //   );
  //   if (existingCookieIndex !== -1) {
  //     currentCookiesHeaders.splice(existingCookieIndex, 1);
  //   }
  //   // Add the new cookie
  //   currentCookiesHeaders.push({
  //     name: cookie.name,
  //     value: cookie.value,
  //   });
  // }
  // // Set "Set-Cookie" header
  // headers["Set-Cookie"] = currentCookiesHeaders
  //   .map((cookie) => `${cookie.name}=${cookie.value}`)
  //   .join("; ");
  // return new Response(body, { status, headers });
  return event;
};

// type ResolveHTTPResponseOptions<TRouter extends AnyRouter, TRequest extends HTTPRequest> = Omit<HTTPBaseHandlerOptions<TRouter, TRequest>, 'unstable_onChunk' | 'unstable_onHead'>;

const createCustomTRPCHandle: CreateTRPCHandleFunction = ({
  router,
  url = "/",
  createContext: createReqContext,
  responseMeta,
  onError,
}) => {
  return async ({ event, resolve }) => {
    event.locals.log = po;
    if (event.url.pathname.startsWith(url + "/")) {
      const request = event.request;
      const req = {
        method: request.method,
        headers: request.headers,
        query: event.url.searchParams,
        body: await request.text(),
      };
      // Using the default `event.setHeaders` and `event.cookies` will not work
      // as the event in not resolved by SvelteKit. Instead, we "proxy" the access
      // to the headers.
      const originalSetHeaders = event.setHeaders;
      const headersProxy: Record<string, string> = {};
      event.setHeaders = (headers) => {
        for (const [key, value] of Object.entries(headers)) {
          headersProxy[key] = value;
        }
        // Still call the original `event.setHeaders` function, as it may be used in SvelteKit internals.
        originalSetHeaders(headers);
      };
      const httpResponse = await resolveHTTPResponse({
        router,
        req,
        path: event.url.pathname.substring(url.length + 1),
        createContext: async () => createContext?.(event),
        responseMeta,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: onError,
      } as ResolveHTTPResponseOptions);

      const { status, headers, body } = httpResponse;
      if (!status || !headers || !body) {
        return resolve(event);
      }
      // Set headers and cookies that were set using SvelteKit's `event.setHeaders` and `event.cookies.set`.
      for (const [key, value] of Object.entries(headersProxy)) {
        headers[key] = value;
      }
      // Current cookies from TRPC
      const currentCookiesHeaders =
        (headers["Set-Cookie"] as string)?.split("; ").map((cookie) => {
          const name = cookie.split("=")[0];
          const value = cookie.split("=").at(1);
          return { name, value };
        }) ?? [];
      // Add / Replace cookies from SvelteKit
      for (const cookie of event.cookies.getAll()) {
        // Remove existing cookie
        const existingCookieIndex = currentCookiesHeaders.findIndex(
          (c) => c.name === cookie.name
        );
        if (existingCookieIndex !== -1) {
          currentCookiesHeaders.splice(existingCookieIndex, 1);
        }
        // Add the new cookie
        currentCookiesHeaders.push({
          name: cookie.name,
          value: cookie.value,
        });
      }
      // Set "Set-Cookie" header
      headers["Set-Cookie"] = currentCookiesHeaders
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      return new Response(body, { status, headers: headers as HeadersInit });
    }
    return resolve(event);
  };
};
