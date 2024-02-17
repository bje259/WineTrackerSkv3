// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { SuperValidated } from "sveltekit-superforms";
import { loginUserDto } from "$lib/Schemas";
import type { User, Admin, BottleRecordsSchema } from "$lib/types";
import type Writable from "svelte/store";
import PocketBase from "pocketbase";
import { crudSchema } from "$lib/Schemas";
import { z } from "zod";
import { UserDB as User, Admin } from "$lib/types";
import { TypedPocketBase } from "$lib/pocketbase-types";
import { ValidAuthProviders } from "$lib/types";
import type {
  UserRecord,
  BottlesDBRecord,
  UserDBRecord,
  BottlesDBResponse,
} from "$lib/pocketbase-types";

type BottlesDB = z.infer<typeof crudSchema>[];
// type ValidAuthProviders = string[];

declare global {
  namespace App {
    interface Locals {
      pb: TypedPocketBase;
      user?: UserRecord;
      admin?: Admin;
    }
    // trying to define the interface below broke many things
    interface PageData {
      flash?: { type: "success" | "error"; message: string };
      user?: UserRecord;
      admin?: Admin;
      form?: SuperValidated;
      loginPageData?: {
        form?: SuperValidated<typeof loginUserDto>;
        validAuthProviders?: ValidAuthProviders;
        user?: UserRecord;
        admin?: Admin;
      };
      bottlePreLoad?: {
        form: SuperValidated<typeof crudSchema>;
        bottlesDB: BottlesDBResponse[];
      };
      validAuthProviders?: ValidAuthProviders;
    }
    // interface Error {}

    // interface Platform {}
    interface PageState {
      user?: UserRecord;
      flash?: { type: "success" | "error"; message: string };
      admin?: Admin;
      form?: SuperValidated;
      bottlesDB?: BottlesDBResponse[];
      loginPageData?: {
        form?: SuperValidated<typeof loginUserDto>;
        validAuthProviders?: ValidAuthProviders;
        user?: UserRecord;
        admin?: Admin;
      };
      bottlePreLoad?: {
        form?: SuperValidated<typeof crudSchema>;
        bottlesDB?: BottlesDBResponse[];
      };
      validAuthProviders?: ValidAuthProviders;
    }
  }
}
