import { t } from "$lib/trpc/t";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ClientResponseError, type ListOptions } from "pocketbase";
import pb from "pocketbase";
// import { pbAsAdmin } from "$lib/pocketbase/admin.server";
import {
  protectedProcedure,
  publicProcedure,
  middleware,
  adminProcedure,
  overrideProcedure,
  override,
} from "$lib/trpc/middleware";
import { p, pt, PO } from "$lib/utils.js";
import type {
  WineInfo,
  WineFacts,
  Recommendedvintage,
  Stylestats,
  BaseStats,
} from "../../../lib";
import {
  type WineInfoDataResponse,
  WineInfoDataResponseSchema,
  validateZodResponseSchema,
  Collections,
  type TypedPocketBase,
} from "$lib/WineTypes.js";
const log = new PO();
const { auth, logger, admin } = middleware;
// const adminPb = pbAsAdmin();

async function getRecordList(
  input: {
    collection: string;
    opts: {
      page?: number;
      perPage?: number;
      sort?: string;
      filter?: string;
      expand?: string;
      fields?: string;
      requestKey?: string;
    };
  },
  ctx: { pb: TypedPocketBase; log: PO }
) {
  const { collection } = input;
  const { page, perPage, sort, filter, expand, fields, requestKey } =
    input.opts;
  const options: ListOptions = { sort };
  options.requestKey = requestKey ? requestKey : `${collection}List`;
  if (filter) options.filter = filter;
  if (expand) options.expand = expand;
  if (fields) options.fields = fields;
  const pb = ctx.pb;

  try {
    const data = await pb
      .collection(collection)
      .getList(page, perPage, options);
    return data.items;
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      throw new TRPCError({
        code: e.response.code || 500,
        message: e.response.message,
      });
    }
  }

  return undefined;
}

const getRecordListInputSchema = z.object({
  collection: z.string(),
  opts: z.object({
    page: z.number().default(1),
    perPage: z.number().default(50),
    sort: z.string().default("-id"),
    filter: z.string().optional().nullable(),
    expand: z.string().optional().nullable(),
    fields: z.string().optional().nullable(),
    requestKey: z.string().optional().nullable(),
  }),
});

export const pbCollection = t.router({
  getList: overrideProcedure.use(logger).query(async ({ ctx }) => {
    try {
      const collection = await ctx.pb.collections.getFullList<Collections>();
      return collection;
    } catch (e: unknown) {
      if (e instanceof ClientResponseError && !e.isAbort) {
        throw new TRPCError({
          code: e.response.code || 500,
          message: e.response.message,
        });
      }
    }
  }),
  getRecords: adminProcedure
    .use(logger)
    .input((input) => {
      try {
        log.p("input: ", input);
        const result = getRecordListInputSchema.parse(input);
        log.p("result: ", result);
        if (!result.opts.requestKey) {
          result.opts.requestKey = `${result.collection}List`;
        }
        const collection = result.collection;
        const opts: {
          page?: number;
          perPage?: number;
          sort?: string;
          filter?: string;
          expand?: string;
          fields?: string;
          requestKey?: string;
        } = result.opts as any;
        return { collection, opts };
      } catch (e: unknown) {
        if (e instanceof z.ZodError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid input: " + e.message,
          });
        }
        throw new Error("Unknown error", e as any);
      }
    })
    .query(async ({ input, ctx }) => await getRecordList(input, ctx)),
});
