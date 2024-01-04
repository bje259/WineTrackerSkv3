// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { SuperValidated } from "sveltekit-superforms";
import { loginUserDto } from "$lib/Schemas";
import type { User, Admin } from "$lib/types";
import type Writable from "svelte/store";
import PocketBase from "pocketbase";
import { crudSchema } from "$lib/Schemas";
type BottlesDB = z.infer<typeof crudSchema>[];

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
      user?: User;
      admin?: Admin;
    }
    // trying to define the interface below broke many things
    interface PageData {
      user?: User;
      admin?: Admin;
    }
    // interface Error {}

    // interface Platform {}
    interface PageState {
      loginPageData?: {
        form: SuperValidated<typeof loginUserDto>;
      };
      bottlePreLoad?: {
        form: SuperValidated<typeof crudSchema>;
        bottlesDB: BottlesDB;
      };
    }
  }
}
