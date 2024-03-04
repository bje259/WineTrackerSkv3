import { t } from "$lib/trpc/t";
import { ApifyClient } from "apify-client";
import { z } from "zod";
import { APIFY_TOKEN } from "$env/static/private";
import { keyCode } from "$lib/WineTypes";
import { type BottlesDBResponse } from "$lib/WineTypes";
import {
  middleware,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../middleware/";
const { auth, logger } = middleware;

export const testMatchRoute = adminProcedure
  .use(logger)
  .query(async ({ ctx }) => {
    const client = new ApifyClient({
      token: APIFY_TOKEN,
    });
    const { pb } = ctx;
    const wineCollection = await pb
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
        searchUrl = searchUrl
          .replace("https___", "https://")
          .replace(/_/g, "/");

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
    return KVpairs;
  });
