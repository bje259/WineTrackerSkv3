import type { RequestHandler } from "./$types.d.ts";
import type {
  WineInfo,
  WineFacts,
  Stylestats,
  Recommendedvintage,
} from "$lib/index.js";
import { error, json } from "@sveltejs/kit";
import { ClientResponseError, type ListOptions } from "pocketbase";
import type {
  WineFactsRecord,
  WineInfoRecord,
  WineInfoDataRecord,
  WineInfoDataResponse,
  FoodPairingsRecord,
  StylestatsRecord,
  RecommendedvintageRecord,
  InterestingFactsRecord,
  BaseStatsRecord,
  RecordIdString,
  BottlesDBResponse,
} from "$lib/WineTypes.js";
import {
  WineFactsRecordSchema,
  Collections,
  WineInfoRecordSchema,
  WineInfoDataRecordSchema,
  FoodPairingsRecordSchema,
  UsersRecordSchema,
  StylestatsRecordSchema,
  RecommendedvintageRecordSchema,
  InterestingFactsRecordSchema,
  BottlesDBRecordSchema,
  BaseStatsRecordSchema,
  FoodPairingsRecordSchemaArray,
  convertFulltoWID,
  keyCode,
} from "$lib/WineTypes.js";
import { p, pt } from "$lib/utils.js";
import { APIFY_TOKEN } from "$env/static/private";
import { ApifyClient } from "apify-client";

export const GET: RequestHandler = async ({ locals, url }) => {
  p("Url: ", url);
  const client = new ApifyClient({
    token: APIFY_TOKEN,
  });

  const wineCollection = await locals.pb
    .collection("BottlesDB")
    .getFullList<Partial<BottlesDBResponse>>({ fields: "Name, Producer" });

  const kvstore = client.keyValueStore("bje259/searchTermMap");
  const kvkeys = await kvstore.listKeys();
  const kvkeyarray = kvkeys.items.map((item) => item.key);
  // p("Keys: ", kvkeys);
  const KVpairs = await Promise.all(
    kvkeyarray.map(async (key) => {
      const record = await kvstore.getRecord(key);
      const code = keyCode(key);
      let searchUrl: string = "";
      if (typeof record?.value === "string") {
        searchUrl = record?.value;
      }
      searchUrl = searchUrl.replace("https___", "https://").replace(/_/g, "/");

      searchUrl = decodeURIComponent(searchUrl); //.replace(/\\"$/, "");
      searchUrl = searchUrl.replace(/\\/g, "");
      searchUrl = searchUrl.replace(/"/g, "");
      const searchParams = searchUrl.substring(searchUrl.indexOf("?q=") + 3);
      const keyUrl = key.replace("https___", "https://").replace(/_/g, "/");
      return {
        code: code,
        searchParams: searchParams,
        key: key,
        recordValues: record?.value ?? "",
        searchUrl: searchUrl,
        keyUrl: keyUrl,
      };
    })
  );

  const matchedWines = wineCollection.map((item) => {
    const matchString = item.Producer + " " + item.Name;
    const code = KVpairs.find((pair) => {
      return pair.searchParams.includes(matchString);
    });
    if (code) {
      // p("Match: ", code);
    }
    return {
      ...item,
      code: code?.code ?? "N/A",
      searchUrl: code?.searchUrl ?? "N/A",
      keyUrl: code?.keyUrl ?? "N/A",
    };
  });

  // return json(matchedWines);
  return json(KVpairs);
};

export const POST: RequestHandler = async ({ locals, request, fetch }) => {
  const body = await request.json();
  p("Body: ", body);
  const wineResult: WineInfoDataRecord = await convertFulltoWID(
    body,
    "https:",
    locals,
    fetch
  );

  return json(wineResult);
};
