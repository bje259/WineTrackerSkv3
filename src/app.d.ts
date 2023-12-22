// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { SuperValidated } from "sveltekit-superforms";
import { loginUserDto } from "$lib/Schemas";
import type { User } from "$lib/types";
import type Writable from "svelte/store";
import PocketBase from "pocketbase";

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
      user: User;
    }
    // trying to define the interface below broke many things
    interface PageData {
      user: User;
    }
    // interface Error {}
    // interface Platform {}
    interface PageState {
      loginPageData: {
        form: SuperValidated<typeof loginUserDto>;
      };
    }
  }
}
