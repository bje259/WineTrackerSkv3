// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { SuperValidated } from "sveltekit-superforms";
import { loginUserDto } from "$lib/Schemas";
import type { User, Admin, BottleRecordsSchema } from "$lib/types";
import type Writable from "svelte/store";
import PocketBase from "pocketbase";
import { crudSchema } from "$lib/Schemas";
type BottlesDB = z.infer<typeof crudSchema>[];
type ValidAuthProviders = string[];

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
      user?: User;
      admin?: Admin;
    }
    // trying to define the interface below broke many things
    interface PageData {
      flash?: { type: "success" | "error"; message: string };
      user?: User;
      admin?: Admin;
      form?: SuperValidated;
      loginPageData?: {
        form?: SuperValidated<typeof loginUserDto>;
        validAuthProviders?: ValidAuthProviders;
        user?: User;
        admin?: Admin;
      };
      bottlePreLoad?: {
        form: SuperValidated<typeof crudSchema>;
        bottlesDB: BottleRecordsSchema;
      };
      validAuthProviders?: ValidAuthProviders;
    }
    // interface Error {}

    // interface Platform {}
    interface PageState {
      user?: User;
      flash?: { type: "success" | "error"; message: string };
      admin?: Admin;
      form?: SuperValidated;
      bottlesDB?: BottleRecordsSchema;
      loginPageData?: {
        form?: SuperValidated<typeof loginUserDto>;
        validAuthProviders?: ValidAuthProviders;
        user?: User;
        admin?: Admin;
      };
      bottlePreLoad?: {
        form?: SuperValidated<typeof crudSchema>;
        bottlesDB?: BottleRecordsSchema;
      };
      validAuthProviders?: ValidAuthProviders;
    }
  }
}
