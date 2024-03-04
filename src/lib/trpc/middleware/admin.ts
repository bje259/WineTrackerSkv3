import { t } from "$lib/trpc/t";
import { TRPCError } from "@trpc/server";
import { type Context } from "$lib/trpc/context";
import { PO } from "$lib/utils";
import pbAsAdmin from "$lib/pocketbase/admin.server";

const localP = new PO(true);

export const admin = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId || !ctx.pb) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  localP.p("start of admin middleware");
  localP.p("isAdmin: ", ctx.pb.authStore.isAdmin);
  localP.p("userId: ", ctx.userId);

  const originalPB = ctx.pb;
  try {
    // Fetch user roles only if they are not already present in the context
    if (!ctx.userRoles) {
      const userRoles = await ctx.pb
        .collection("UserRoleAssignments")
        .getList(1, 50, {
          fields: "RoleName",
          filter: `userId="${ctx.userId}"`,
        })
        .then((x) => x.items.map((item) => ({ RoleName: item.RoleName })));

      localP.p("userRoles: ", userRoles);
      ctx.userRoles = userRoles;
    }

    // Check if the user has the "Admin" role
    if (ctx.userRoles.some((role) => role.RoleName === "Admin")) {
      localP.p("user is an admin");
      ctx.pb = await pbAsAdmin();
    } else {
      localP.p("user is not an admin");
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  } catch (e) {
    localP.p("Error getting userRoles: ", e);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    const result = await next({ ctx });
    // localP.p("admin middleware result: ", result);

    // Revert any changes made to the context, if necessary
    ctx.pb = originalPB;

    return result;
  } catch (e) {
    ctx.pb = originalPB; // Ensure original context state is restored on error
    throw e; // Re-throw the error for upstream handling
  }
});
