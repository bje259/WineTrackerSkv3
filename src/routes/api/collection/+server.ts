import type { RequestHandler } from "./$types";
import {
  OPENAI_ACTION_KEY,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "$env/static/private";
import { PUBLIC_PB_HOST } from "$env/static/public";
import { error, json, redirect } from "@sveltejs/kit";
import PocketBase from "pocketbase";
import { bottleRecordSchema } from "$lib/Schemas";
import { z } from "zod";

const bottleName = bottleRecordSchema.pick({ Name: true });
const userCheck = bottleRecordSchema.shape.UserId;
type BottleDB = z.infer<typeof bottleRecordSchema>;
type BottleName = z.infer<typeof bottleName>;
type BottlesDB = BottleDB[];
type BottleNames = BottleName[];

/** @type {import('./$types').RequestHandler} */
export const POST: RequestHandler = async ({ url, request }) => {
  let bottlesDB: BottlesDB;
  let bottleNames: BottleNames;
  //const incomingApiKey = url.searchParams.get("key");
  const incomingApiKey = request.headers.get("x-api-key");
  const reqUser = url.searchParams.get("user");
  // console.log(
  // "🚀 ~ file: +server.ts:27 ~ constPOST:RequestHandler= ~ reqUser:",
  // reqUser
  // );

  if (!reqUser || userCheck.safeParse(reqUser).success === false) {
    console.log(
      "Error, invalid user check1",
      reqUser,
      userCheck.safeParse(reqUser)
    );
    return new Response("Invalid user", { status: 400 });
  }
  // Validate the API key
  if (incomingApiKey !== OPENAI_ACTION_KEY) {
    console.log("Error, invalid API key");
    return new Response("Invalid API key", { status: 401 });
  }

  const pb = new PocketBase(PUBLIC_PB_HOST);

  try {
    const authData = await pb.admins.authWithPassword(
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    // after the above you can also access the auth data from the authStore
    console.log("valid admin?: ", pb.authStore.isValid);
    console.log("token", pb.authStore.token);
    console.log("model.id?:", pb.authStore.model?.id);

    if (pb.authStore.isValid) {
      bottlesDB = await pb.collection("BottlesDB").getFullList<BottleDB>({
        filter: `UserId.id = "${reqUser}"`,
        sort: "Name",
      });
      // console.log(
      // "🚀 ~ file: +server.ts:60 ~ bottlesDB=awaitpb.collection ~ bottlesDB:",
      // bottlesDB
      // );

      bottleNames = bottlesDB.map((b) => ({
        Name: b.Name,
        Producer: b.Producer,
      }));
      // console.log(
      // "🚀 ~ file: +server.ts:63 ~ constPOST:RequestHandler= ~ bottleNames:",
      // bottleNames
      // );
    } else {
      console.log("Error, server admin login failed");
      return new Response("Invalid user", { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // console.log("🚀 ~ file: +server.ts:67 ~ constPOST:RequestHandler= ~ e:", e);
    console.log("Catchall error");
    return new Response("Error unknown", { status: 400 });
  }
  // "logout" the last authenticated account
  pb.authStore.clear();

  const response = json(bottleNames);
  // response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");

  return response;
};
