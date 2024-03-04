import { auth } from "./auth";
import { logger } from "./logger";
import { t } from "../t";
import { admin } from "./admin";
import { override } from "./override";

export const middleware = {
  auth,
  logger,
  admin,
  override,
};

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(auth);
export const adminProcedure = protectedProcedure.use(admin);
export const overrideProcedure = publicProcedure.use(override);

export { auth };
export { logger };
export { admin };
export { override };
export default middleware;
