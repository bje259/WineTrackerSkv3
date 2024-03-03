import { PUBLIC_PB_HOST } from "$env/static/public";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";
import Pocketbase from "pocketbase";

/**
 * Pocketbase instance authenticated as an admin using `ADMIN_USER` and `ADMIN_PASS` envvars.
 */
export async function pbAsAdmin() {
  const pb = new Pocketbase(PUBLIC_PB_HOST);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

  if (pb.authStore.isValid) {
    return pb;
  }

  pb.authStore.clear();
  throw new Error("ADMIN_USER/ADMIN_PASS not valid");
}

export default pbAsAdmin;
