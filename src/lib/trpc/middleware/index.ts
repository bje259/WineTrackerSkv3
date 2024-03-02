import { auth } from "./auth";
import { logger } from "./logger";
import { t } from "../t";
import { admin } from "./admin";

export const middleware = {
  auth,
  logger,
  admin,
};

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(auth);
export { auth };
export { logger };
export { admin };
export default middleware;
