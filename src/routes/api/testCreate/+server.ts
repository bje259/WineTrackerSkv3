import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { BottleDB } from "$lib";
import type { ClientResponseError } from "pocketbase";

export const POST: RequestHandler = async ({ locals }) => {
  //console.log("🚀 ~ file: +page.server.ts:39 ~ default: ~ request:", request);

  if (!locals.pb.authStore.isValid) throw redirect(303, "/login");

  const bottlesDB = await locals.pb
    .collection("BottlesDB")
    .getFullList<BottleDB>({
      sort: "Name",
    });

  let testBottles: BottleDB[] = [];
  testBottles = [
    {
      Name: "Test Bottle 1",
      Producer: "Producer A",
      Vintage: 2020,
      UserId: locals.user?.id,
    },
    {
      Name: "Test Bottle 2",
      Producer: "Producer B",
      Vintage: 2019,
      UserId: locals.user?.id,
    },
    {
      Name: "Test Bottle 3",
      Producer: "Producer C",
      Vintage: 2018,
      UserId: locals.user?.id,
    },
    {
      Name: "Test Bottle 4",
      Producer: "Producer D",
      Vintage: 2017,
      UserId: locals.user?.id,
    },
    {
      Name: "Test Bottle 5",
      Producer: "Producer E",
      Vintage: 2016,
      UserId: locals.user?.id,
    },
  ];

  for (const testBottle of testBottles) {
    try {
      console.log("creating bottle: ", testBottle);
      await locals.pb.collection("BottlesDB").create(testBottle);
      console.log(
        "🚀 ~ file: +page.server.ts:69 ~ default: ~ bottle:",
        testBottle
      );
    } catch (err) {
      const e = err as ClientResponseError;
      console.log("🚀 ~ file: +page.server.ts:72 ~ default: ~ e:", e);

      return new Response("Error unknown", {
        status: 500,
        statusText: e.message,
      });
    }
  }

  return new Response("Test Bottles Created", {
    status: 200,
    statusText: "OK",
  });
};
