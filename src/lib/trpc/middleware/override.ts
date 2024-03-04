import { t } from "$lib/trpc/t";
import { TRPCError } from "@trpc/server";
import { type Context } from "$lib/trpc/context";
import { PO } from "$lib/utils";
import pbAsAdmin from "$lib/pocketbase/admin.server";

const localP = new PO(true);

export const override = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId || !ctx.pb) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  localP.p("start of override middleware");
  localP.p("isAdmin: ", ctx.pb.authStore.isAdmin);
  localP.p("userId: ", ctx.userId);

  const originalPB = ctx.pb;
  try {
    // Temporarily override the PocketBase client with admin privileges
    ctx.pb = await pbAsAdmin();
    localP.p("Temporary admin privileges granted");

    // Proceed with the next middleware or resolver
    const result = await next({ ctx });

    // After the operation, revert the PocketBase client back
    ctx.pb = originalPB;
    localP.p("Admin privileges reverted");

    return result;
  } catch (e) {
    // In case of any error, revert the PocketBase client before throwing
    ctx.pb = originalPB;
    localP.p("Error encountered, reverting admin privileges");
    throw e;
  }
});
