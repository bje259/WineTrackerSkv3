import { PUBLIC_PB_HOST } from "$env/static/public";
import { env } from "$env/dynamic/private";
import Pocketbase from "pocketbase";
import { PO } from "$lib/utils";

const { ADMIN_EMAIL, ADMIN_PASSWORD } = env;
/**
 * Pocketbase instance authenticated as an admin using `ADMIN_USER` and `ADMIN_PASS` envvars.
 */
export async function pbAsAdmin() {
  const log = new PO(false);
  // log.p("env: ", env);
  const pb = new Pocketbase(PUBLIC_PB_HOST);
  const response = await pb.admins.authWithPassword(
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  );
  log.p("pbAsAdmin resp: ", response);
  log.p("pb.authStore: ", pb.authStore);
  if (pb.authStore.isValid) {
    return pb;
  }

  pb.authStore.clear();
  throw new Error("ADMIN_USER/ADMIN_PASS not valid");
}

export default pbAsAdmin;
