import { browser } from "$app/environment";
import { t } from "$lib/trpc/t";
import { PO } from "$lib/utils";

export const logger = t.middleware(async ({ path, ctx, type, next }) => {
  const log = ctx.log || new PO();
  const start = Date.now();
  let node = "";
  try {
    const temp = __filename ? __filename : "";
    node = temp;
  } catch (e) {
    node = "no node";
  }
  const metadata = browser ? import.meta.url : node;
  if (browser) log.p(`${type} ${path} starting... ${metadata}`);
  const result = await next();
  const ms = Date.now() - start;
  log.p(`${result.ok ? "OK" : "ERR"} ${type} ${path} - ${ms}ms`);
  return result;
});
