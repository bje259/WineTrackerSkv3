import { t } from "$lib/trpc/t";
import { TRPCError } from "@trpc/server";
import { type Context } from "$lib/trpc/context";
import { PO } from "$lib/utils";
import {
  type TypedPocketBase,
  type UserRoleAssignmentsResponse,
} from "$lib/WineTypes.js";
import pbAsAdmin from "$lib/pocketbase/admin.server";

type adminCtx = Context & { userRoles: string[] };
const localP = new PO(true);
export const admin = t.middleware(async ({ next, ctx }) => {
  //   ctx.log.on();
  if (!ctx.userId || !ctx.pb) throw new TRPCError({ code: "UNAUTHORIZED" });
  //  if (ctx.pb.authStore.isAdmin) return next({ ctx });
  if (ctx.pb.authStore.isAdmin) {
    localP.p("isAdmin: ", ctx.pb.authStore.isAdmin);
    localP.p("userId: ", ctx.userId);
    localP.p("user: ", ctx.user);
    localP.p("admin: ", ctx.admin);
    //  return next({ ctx });
  }

  let admCtx: adminCtx;
  try {
    const userRoles = await ctx.pb
      .collection("UserRoleAssignments")
      .getList<UserRoleAssignmentsResponse>(1, 50, {
        fields: "RoleName",
        filter: `userId="${ctx.userId}"`,
      })
      .then((x) => x.items.map((item) => item.RoleName));
    localP.p("userRoles: ", userRoles);

    admCtx = {
      userRoles,
      ...ctx,
    };
    if (userRoles.includes("Admin")) {
      localP.p("user is an admin");
      admCtx.pb = await pbAsAdmin();
    } else {
      localP.p("user is not an admin");
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  } catch (e: unknown) {
    localP.p("Error getting userRoles: ", e);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  localP.p("admCtx: ", admCtx);
  //   ctx.log.off();
  return next({ ctx: admCtx });
});
