// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { SuperValidated } from "sveltekit-superforms";
import { loginUserDto } from "$lib/Schemas";
import type { User } from "$lib/types";

declare global {
  namespace App {
    interface Locals {
      pb: import("pocketbase");
      user: User;
    }
	// trying to define the interface below broke many things
    // interface PageData {
    //   user: User;
    //   load: {
    //     form?: SuperValidated<typeof loginUserDto>;
    //     debug?: boolean;
    //   };
    // }
    // interface Error {}
    // interface Platform {}
    interface PageState {
      loginPageData: {
        form: SuperValidated<typeof loginUserDto>;
        debug: boolean;
      };
    }
  }
}
