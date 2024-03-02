import type { PageServerLoad } from "./$types";
import { error, json } from "@sveltejs/kit";
import {
  ClientResponseError,
  type ListOptions,
  type ListResult,
} from "pocketbase";
import { z } from "zod";
import pb from "pocketbase";
import { p, pt } from "$lib/utils.js";
import type {
  WineInfo,
  WineFacts,
  Recommendedvintage,
  Stylestats,
  BaseStats,
} from "../../../lib";
import {
  type WineInfoDataResponse,
  type WineInfoDataRecord,
  WineInfoDataResponseSchema,
  WineInfoDataRecordSchema,
  validateZodResponseSchema,
  Collections,
} from "$lib/WineTypes.js";

export const load = (async ({ locals, params, url }) => {
  const collection = "WineInfoData";
  const code = params.code;
  p("Get Params: ", collection);
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("perPage") || "50";
  const sort = url.searchParams.get("sort") || "-created,id";
  const filter = url.searchParams.get("filter");
  const expand = url.searchParams.get("expand");
  const fields = url.searchParams.get("fields");
  const requestKey = url.searchParams.get("requestKey") || `${collection}List`;

  const options: ListOptions = { sort, requestKey };
  if (filter) options.filter = filter;
  if (expand) options.expand = expand;
  if (fields) options.fields = fields;
  let data: ListResult<WineInfoDataResponse> | undefined;
  let wineInfoData: WineInfoDataRecord | undefined;
  try {
    if (options.filter) options.filter += `Code=${code}`;
    else options.filter = `Code='${code}'`;
    p("Options: ", options);
    data = await locals.pb
      .collection("WineInfoData")
      .getList<WineInfoDataResponse>(
        parseInt(page),
        parseInt(perPage),
        options
      );
    p("Data after pb ", data);
    if (data.items.length == 0) {
      return error(404, "Not Found");
    }
    const validated = await validateZodResponseSchema<WineInfoDataResponse>(
      Collections.WineInfoData,
      data.items[0]
    );
    if (!validated) {
      return error(500, "Validation Error");
    } else {
      p("Validated Data");
      wineInfoData = WineInfoDataRecordSchema.parse(
        data.items[0]
      ) as WineInfoDataRecord;
    }
  } catch (e: any) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }
  if (!wineInfoData) {
    p("error: data: ", data);
    return error(500, "No Data");
  }
  p("Servr loaded WineInfoData: ", wineInfoData);
  return { wineInfoData: wineInfoData };
}) satisfies PageServerLoad;
