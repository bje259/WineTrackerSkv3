/// <reference types="../../app.d.ts" />
// import App.Locals from "../../app.d.ts";
import PocketBase from "pocketbase";
import { serializeNonPOJOs } from "$lib/utils";
import type { UserDB as User, Admin } from "$lib/types";
import { PUBLIC_PB_HOST } from "$env/static/public";
import { ADMIN_USER_ID } from "$env/static/private";
import type { TypedPocketBase } from "$lib/WineTypes";
import type {
  UsersResponse,
  UsersRecord,
  UserRoleAssignmentsRecord,
} from "$lib/WineTypes";
import { Collections } from "$lib/WineTypes";
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";
import {
  UsersRecordSchema,
  UserRoleAssignmentsRecordSchema,
} from "$lib/WineTypes";
import { AdminSchema } from "$lib/Schemas";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { PO } from "$lib/utils";
import { log } from "console";

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const defPO: PO = new PO(false);
export async function createContext(event: RequestEvent) {
  let result: {
    userId: string;
    pb: TypedPocketBase;
    user: UsersRecord;
    admin?: Admin;
    log: PO;
  };
  const log = event?.locals?.log || defPO;
  // const log = defPO;
  log.p("Test", log.toString());
  log.p("createContext event", event);
  log.p("PUBLIC_PB_HOST", PUBLIC_PB_HOST);
  event.locals.pb = new PocketBase(PUBLIC_PB_HOST) as TypedPocketBase;

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );

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
    // log.p("auth refresh failed");
    event.locals.pb.authStore.clear();
  }

  if (event.locals.pb.authStore.isAdmin) {
    event.locals.admin = serializeNonPOJOs<Admin>(
      event.locals.pb.authStore.model as Admin
    );

    const tempUser = await event.locals.pb
      .collection(Collections.Users)
      .getOne<UsersResponse>(ADMIN_USER_ID);
    const parsedUser = UsersRecordSchema.parse(tempUser);
    event.locals.user = serializeNonPOJOs<UsersRecord>(parsedUser);
  } else if (
    event.locals.pb.authStore.isValid &&
    event.locals.pb.authStore.model
  ) {
    const parsedUser = UsersRecordSchema.parse(
      event.locals.pb.authStore.model as UsersResponse
    );
    event.locals.user = serializeNonPOJOs<UsersRecord>(parsedUser);
  } else {
    // log.p("hooks clearing user");
    event.locals.user = <UsersRecord>{};
  }

  const { locals } = event;
  try {
    const userId = locals?.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }

    result = {
      userId,
      pb: event.locals.pb,
      user: event.locals.user,
      admin: event.locals.admin,
      log: event.locals.log || defPO,
    };
    return result;
  } catch (error) {
    log.p("createContext User Not Found", error);
    result = {
      userId: "",
      pb: event.locals.pb,
      user: event.locals.user,
      admin: event.locals.admin,
      log: defPO,
    };
    return result;
  }
}

export async function createReqContext(event: RequestEvent) {
  const locals = event.locals;
  let ctx: Context;
  let reqCtx: Context;
  const log = event?.locals?.log || defPO;
  // const log = defPO;
  event.locals.log = defPO;
  try {
    const Admin = AdminSchema.partial().parse(locals.admin);
    const User = UsersRecordSchema.parse(locals.user);
    const UserId = z.string().parse(locals.userId);
    const pb = locals.pb;
    if (!pb) {
      throw new Error("PocketBase not found");
    }
    const log = locals.log || defPO;
    reqCtx = {
      admin: Admin,
      user: User,
      userId: UserId,
      pb,
      log,
    };
    return reqCtx;
  } catch (error) {
    log.p(error);
    // throw new TRPCError({
    //   code: "INTERNAL_SERVER_ERROR",
    //   message: "Error parsing context",
    // });
    ctx = await createContext(event);
    return ctx;
  }

  // try {
  //   const userId = ctx.userId;
  //   const user = ctx.user;
  //   const pb = ctx.pb;
  //   if (!userId || !pb) {
  //     throw new Error("User/PB not found");
  //   }
  // } catch (error) {
  //   console.error(error);
  //   throw new TRPCError({
  //     code: "INTERNAL_SERVER_ERROR",
  //     message: "Error parsing context",
  //   });
  // }

  return reqCtx || ctx;
}

export type Context = inferAsyncReturnType<typeof createContext>;

export type ReqContext = inferAsyncReturnType<typeof createReqContext>;
