// browserclient.js
import PocketBase from "pocketbase";
import { PUBLIC_PB_HOST } from "$env/static/public";
import { browser } from "$app/environment";
const pb = new PocketBase(PUBLIC_PB_HOST);
if (browser) {
  pb.authStore.loadFromCookie(document.cookie);

  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  });
  console.log("browserclient.js: pb.authStore", pb.authStore);
}
export default pb; // it is safe to be global in this case
