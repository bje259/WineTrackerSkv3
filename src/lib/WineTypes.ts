import { z } from "zod";
import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";
import { p, pt, PO } from "$lib/utils.js";
const log = new PO(false);
export enum Collections {
  BaseStats = "BaseStats",
  BottlesDB = "BottlesDB",
  InterestingFacts = "Interesting_Facts",
  Recommendedvintage = "Recommendedvintage",
  Stylestats = "Stylestats",
  WineFacts = "WineFacts",
  WineInfo = "WineInfo",
  WineInfoData = "WineInfoData",
  UserRoleAssignments = "UserRoleAssignments",
  WineInfoDataArray = "WineInfoDataArray",
  FoodPairings = "foodPairings",
  Users = "users",
}

export function isValidCollection(value: string): value is Collections {
  return Object.values(Collections).includes(value as Collections);
}

// Zod schemas for system fields
export const BaseSystemFieldsSchema = z.object({
  id: z.string(),
  created: z.string(),
  updated: z.string(),
  collectionId: z.string(),
  collectionName: z.nativeEnum(Collections),
  expand: z.unknown().optional(),
});

export const AuthSystemFieldsSchema = BaseSystemFieldsSchema.extend({
  email: z.string(),
  emailVisibility: z.boolean(),
  username: z.string(),
  verified: z.boolean(),
});

// Zod schemas for each record type

export const BaseStatsRecordSchema = z.object({
  Error: z.string().optional(),
  acidity: z.number().optional(),
  fizziness: z.number().optional(),
  intensity: z.number().optional(),
  sweetness: z.number().optional(),
  tannin: z.number().optional(),
});

export const BottlesDBRecordSchema = z.object({
  Bin: z.string().optional(),
  Consumed: z.string().optional(),
  Name: z.string(),
  Notes: z.string().optional(),
  Producer: z.string(),
  Purchased: z.string().optional(),
  UserId: z.string(),
  Varietal: z.string().optional(),
  VineyardLoc: z.string().optional(),
  VineyardName: z.string().optional(),
  Vintage: z.number(),
});

export const InterestingFactsRecordSchema = z.object({
  Interesting_Fact: z.string().optional(),
});

export const RecommendedvintageRecordSchema = z.object({
  type: z.string().optional(),
  year: z.number().optional(),
});

export const StylestatsRecordSchema = z.object({
  Acidity_Description: z.string().optional(),
  Acidity_Rating: z.number().optional(),
  BaseStats: z.string().optional(),
  Body_Description: z.string().optional(),
  Body_Rating: z.number().optional(),
  Description: z.string().optional(),
  Interesting_Facts: z.array(z.string()).optional(),
});

export const WineFactsRecordSchema = z.object({
  Alcohol_content: z.string().optional(),
  Allergens: z.string().optional(),
  Grapes: z.string().optional(),
  Region: z.string().optional(),
  Wine_Name: z.string().optional(),
  Wine_description: z.string().optional(),
  Wine_style: z.string().optional(),
  Winery: z.string().optional(),
  data: z.string().optional(),
});

export const WineInfoRecordSchema = z.object({
  foodPairings: z.array(z.string()).optional(),
  image: z.string().optional(),
  recommended_vintages: z.array(z.string()).optional(),
  style: z.string().optional(),
  stylestats: z.string().optional(),
  varietal: z.string().optional(),
  wineFacts: z.string().optional(),
  wineryRating: z.number().optional(),
});

export const WineInfoDataRecordSchema = z.object({
  BaseStats_acidity: z.number().optional(),
  BaseStats_fizziness: z.number().optional(),
  BaseStats_intensity: z.number().optional(),
  BaseStats_sweetness: z.number().optional(),
  BaseStats_tannin: z.number().optional(),
  Code: z.string().optional(),
  Facts_alcohol_content: z.string().optional(),
  Facts_allergens: z.string().optional(),
  Facts_grapes: z.string().optional(),
  Facts_interesting_facts: z.string().optional(),
  Facts_region: z.string().optional(),
  Facts_wine_desc: z.string().optional(),
  Facts_winery: z.string().optional(),
  Facts_winery_rating: z.number().optional(),
  FoodPairings: z.string().optional(),
  FoodPairingLink: z.array(z.string()).optional(),
  Image: z.string().optional(),
  Recommended_vintages: z.string().optional(),
  Style: z.string().optional(),
  StyleStats_acidity_desc: z.string().optional(),
  StyleStats_acidity_rating: z.number().optional(),
  StyleStats_body_desc: z.string().optional(),
  StyleStats_body_rating: z.number().optional(),
  Varietal: z.string().optional(),
  WineName: z.string().optional(),
  Summary: z.string().optional(),
});

export const WineInfoDataRecordArraySchema = z.array(WineInfoDataRecordSchema);

export const FoodPairingsRecordSchema = z.object({
  foodPairing: z.string().optional(),
});

export const FoodPairingsRecordSchemaArray = z.array(z.string());

export const UsersRecordSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().optional(),
  id: z.string().optional(),
  UserRoles: z.array(z.string()).optional(),
  email: z.string().optional(),
  emailVisibility: z.boolean().optional(),
  username: z.string().optional(),
  verified: z.boolean().optional(),
});
export const UserRoleAssignmentsRecordSchema = z.object({
  Collections: z.array(z.nativeEnum(Collections)).optional(),
  Enabled: z.boolean().optional(),
  RoleId: z.string().optional(),
  RoleName: z.string(),
  UsrRlId: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
  userId: z.string().optional(),
});

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type BaseStatsRecord = {
  Error?: string;
  acidity?: number;
  fizziness?: number;
  intensity?: number;
  sweetness?: number;
  tannin?: number;
};

export type BottlesDBRecord = {
  Bin?: string;
  Consumed?: string;
  Name: string;
  Notes?: string;
  Producer: string;
  Purchased?: string;
  UserId: RecordIdString;
  Varietal?: string;
  VineyardLoc?: string;
  VineyardName?: string;
  Vintage: number;
};

export type InterestingFactsRecord = {
  Interesting_Fact?: string;
};

export type RecommendedvintageRecord = {
  type?: string;
  year?: number;
};
/**
 * StylestatsRecord
 * @property {string} Acidity_Description
 * @property {number} Acidity_Rating
 * @property {string} Body_Description
 * @property {number} Body_Rating
 * @property {string} Description
 * @property {string[]} Interesting_Facts
 * @property {RecordIdString} BaseStats
 * @type {object}
 */
export type StylestatsRecord = {
  Acidity_Description?: string;
  Acidity_Rating?: number;
  BaseStats?: RecordIdString;
  Body_Description?: string;
  Body_Rating?: number;
  Description?: string;
  Interesting_Facts?: RecordIdString[];
};
/**
 * WineFactsRecord
 * @property {string} Alcohol_content - The alcohol content of the wine.
 * @property {string} Allergens - Any allergens present in the wine.
 * @property {string} Grapes - The type of grapes used to make the wine.
 * @property {string} Region - The region where the wine was produced.
 * @property {string} Wine_Name - The name of the wine.
 * @property {string} Wine_description - A description of the wine.
 * @property {string} Wine_style - The style of the wine.
 * @property {string} Winery - The winery that produced the wine.
 * @property {string} data - Additional data related to the wine.
 * @type {object}
 */
export type WineFactsRecord = {
  Alcohol_content?: string;
  Allergens?: string;
  Grapes?: string;
  Region?: string;
  Wine_Name?: string;
  Wine_description?: string;
  Wine_style?: string;
  Winery?: string;
  data?: string;
};
/**
 * WineInfoRecord
 * @property {RecordIdString[]} foodPairings - Array of food pairings IDs.
 * @property {string} image - URL to an image of the wine.
 * @property {RecordIdString[]} recommended_vintages - Array of recommended vintage IDs.
 * @property {string} style - The style of the wine.
 * @property {RecordIdString} stylestats - ID of the style stats record.
 * @property {string} varietal - The varietal of the wine.
 * @property {RecordIdString} wineFacts - ID of the wine facts record.
 * @property {number} wineryRating - The rating of the winery.
 * @type {object}
 */
export type WineInfoRecord = {
  foodPairings?: RecordIdString[];
  image?: string;
  recommended_vintages?: RecordIdString[];
  style?: string;
  stylestats?: RecordIdString;
  varietal?: string;
  wineFacts?: RecordIdString;
  wineryRating?: number;
};
/**
 * WineInfoDataRecord
 * @property {number} BaseStats_acidity - The acidity level of the wine.
 * @property {number} BaseStats_fizziness - The fizziness level of the wine.
 * @property {number} BaseStats_intensity - The intensity level of the wine.
 * @property {number} BaseStats_sweetness - The sweetness level of the wine.
 * @property {number} BaseStats_tannin - The tannin level of the wine.
 * @property {string} Code - Unique code identifying the wine.
 * @property {string} Facts_alcohol_content - The alcohol content of the wine.
 * @property {string} Facts_allergens - Any allergens present in the wine.
 * @property {string} Facts_grapes - The type of grapes used to make the wine.
 * @property {string} Facts_interesting_facts - Interesting facts about the wine.
 * @property {string} Facts_region - The region where the wine was produced.
 * @property {string} Facts_wine_desc - A description of the wine.
 * @property {string} Facts_winery - The winery that produced the wine.
 * @property {number} Facts_winery_rating - The rating of the winery.
 * @property {string} FoodPairings - Food pairings for the wine.
 * @property {RecordIdString[]} FoodPairingLink - Array of food pairing IDs.
 * @property {string} Image - URL to an image of the wine.
 * @property {string} Recommended_vintages - Recommended vintages for the wine.
 * @property {string} Style - The style of the wine.
 * @property {string} StyleStats_acidity_desc - Description of the acidity of the wine.
 * @property {number} StyleStats_acidity_rating - Rating of the acidity of the wine.
 * @property {string} StyleStats_body_desc - Description of the body of the wine.
 * @property {number} StyleStats_body_rating - Rating of the body of the wine.
 * @property {string} Varietal - The varietal of the wine.
 * @property {string} WineName - The name of the wine.
 * @property {string} Summary - A summary of the wine.
 * @type {object}
 */
export type WineInfoDataRecord = {
  BaseStats_acidity?: number;
  BaseStats_fizziness?: number;
  BaseStats_intensity?: number;
  BaseStats_sweetness?: number;
  BaseStats_tannin?: number;
  Code?: string;
  Facts_alcohol_content?: string;
  Facts_allergens?: string;
  Facts_grapes?: string;
  Facts_interesting_facts?: string;
  Facts_region?: string;
  Facts_wine_desc?: string;
  Facts_winery?: string;
  Facts_winery_rating?: number;
  FoodPairings?: string;
  FoodPairingLink?: RecordIdString[];
  Image?: string;
  Recommended_vintages?: string;
  Style?: string;
  StyleStats_acidity_desc?: string;
  StyleStats_acidity_rating?: number;
  StyleStats_body_desc?: string;
  StyleStats_body_rating?: number;
  Varietal?: string;
  WineName?: string;
  Summary?: string;
};

export type FoodPairingsRecord = {
  foodPairing?: RecordIdString;
};

export type UsersRecord = {
  avatar?: string;
  name?: string;
  id?: string;
  UserRoles?: string[];
  email?: string;
  emailVisibility?: boolean;
  username?: string;
  verified?: boolean;
};
export type UserRoleAssignmentsRecord = {
  Collections?: null | Collections[];
  Enabled?: boolean;
  RoleId?: RecordIdString;
  RoleName: string;
  UsrRlId?: RecordIdString;
  expiryDate?: IsoDateString;
  userId?: RecordIdString;
};

// Response types include system fields and match responses from the PocketBase API
export type BaseStatsResponse<Texpand = unknown> = Required<BaseStatsRecord> &
  BaseSystemFields<Texpand>;
export type BottlesDBResponse<Texpand = unknown> = Required<BottlesDBRecord> &
  BaseSystemFields<Texpand>;
export type InterestingFactsResponse<Texpand = unknown> =
  Required<InterestingFactsRecord> & BaseSystemFields<Texpand>;
export type RecommendedvintageResponse<Texpand = unknown> =
  Required<RecommendedvintageRecord> & BaseSystemFields<Texpand>;
export type StylestatsResponse<Texpand = unknown> = Required<StylestatsRecord> &
  BaseSystemFields<Texpand>;
export type WineFactsResponse<Texpand = unknown> = Required<WineFactsRecord> &
  BaseSystemFields<Texpand>;
export type WineInfoResponse<Texpand = unknown> = Required<WineInfoRecord> &
  BaseSystemFields<Texpand>;
export type WineInfoDataResponse<Texpand = unknown> =
  Required<WineInfoDataRecord> & BaseSystemFields<Texpand>;
export type FoodPairingsResponse<Texpand = unknown> =
  Required<FoodPairingsRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;
export type UserRoleAssignmentsResponse<Texpand = unknown> =
  Required<UserRoleAssignmentsRecord> & BaseSystemFields<Texpand>;

// Zod schemas for the above types
// import { z } from "zod";

export const BaseStatsResponseSchema = BaseStatsRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const BottlesDBResponseSchema = BottlesDBRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const InterestingFactsResponseSchema =
  InterestingFactsRecordSchema.extend(BaseSystemFieldsSchema.shape);
export const RecommendedvintageResponseSchema =
  RecommendedvintageRecordSchema.extend(BaseSystemFieldsSchema.shape);
export const StylestatsResponseSchema = StylestatsRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const WineFactsResponseSchema = WineFactsRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const WineInfoResponseSchema = WineInfoRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const WineInfoDataResponseSchema = WineInfoDataRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const FoodPairingsResponseSchema = FoodPairingsRecordSchema.extend(
  BaseSystemFieldsSchema.shape
);
export const UsersResponseSchema = UsersRecordSchema.required().extend(
  AuthSystemFieldsSchema.shape
);
export const UserRoleAssignmentsResponseSchema =
  UserRoleAssignmentsRecordSchema.extend(BaseSystemFieldsSchema.shape);

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  BaseStats: BaseStatsRecord;
  BottlesDB: BottlesDBRecord;
  Interesting_Facts: InterestingFactsRecord;
  Recommendedvintage: RecommendedvintageRecord;
  Stylestats: StylestatsRecord;
  WineFacts: WineFactsRecord;
  WineInfo: WineInfoRecord;
  WineInfoData: WineInfoDataRecord;
  UserRoleAssignments: UserRoleAssignmentsRecord;
  foodPairings: FoodPairingsRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  BaseStats: BaseStatsResponse;
  BottlesDB: BottlesDBResponse;
  Interesting_Facts: InterestingFactsResponse;
  Recommendedvintage: RecommendedvintageResponse;
  Stylestats: StylestatsResponse;
  WineFacts: WineFactsResponse;
  WineInfo: WineInfoResponse;
  WineInfoData: WineInfoDataResponse;
  foodPairings: FoodPairingsResponse;
  users: UsersResponse;
  UserRoleAssignments: UserRoleAssignmentsResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: "BaseStats"): RecordService<BaseStatsResponse>;
  collection(idOrName: "BottlesDB"): RecordService<BottlesDBResponse>;
  collection(
    idOrName: "Interesting_Facts"
  ): RecordService<InterestingFactsResponse>;
  collection(
    idOrName: "Recommendedvintage"
  ): RecordService<RecommendedvintageResponse>;
  collection(idOrName: "Stylestats"): RecordService<StylestatsResponse>;
  collection(idOrName: "WineFacts"): RecordService<WineFactsResponse>;
  collection(idOrName: "WineInfo"): RecordService<WineInfoResponse>;
  collection(idOrName: "WineInfoData"): RecordService<WineInfoDataResponse>;
  collection(idOrName: "foodPairings"): RecordService<FoodPairingsResponse>;
  collection(idOrName: "users"): RecordService<UsersResponse>;
  collection(
    idOrName: "UserRoleAssignments"
  ): RecordService<UserRoleAssignmentsResponse>;
};
export interface WineData {
  //   wineFacts: Record<string, any>;
  wineFacts: WineFacts;
  code: string;
  wineryRating: number;
  foodPairings: string[];
  style: string;
  varietal: string;
  //   stylestats: {
  //     description: string;
  //     interestingFacts: string;
  //     bodyRating: number;
  //     bodyDesc: string;
  //     acidityRating: number;
  //     acidityDesc: string;
  //     BaseStats: Record<string, number>;
  //   };
  styleStats: Stylestats;
  recommended_vintages: Recommendedvintage[] | Recommendedvintage | string;
  image: string;
  summary?: string;
}

export interface WineInfo {
  wineFacts: WineFacts;
  code?: string;
  wineryRating: number;
  foodPairings: string[];
  style: string;
  varietal: string;
  styleStats: Stylestats;
  recommended_vintages: Recommendedvintage[] | Recommendedvintage | string;
  image: string;
  summary?: string;
}

export interface Recommendedvintage {
  year: number;
  type: string;
}

export interface Stylestats {
  Description: string;
  "Interesting Facts": string[] | string;
  "Body Rating": number;
  "Body Description": string;
  "Acidity Rating": number;
  "Acidity Description": string;
  BaseStats: BaseStats;
}

export interface BaseStats {
  acidity?: number;
  fizziness?: number;
  intensity?: number;
  sweetness?: number;
  tannin?: number;
  Error?: string;
}

export interface WineFacts {
  "Wine Name"?: string;
  wineName?: string;
  Winery?: string;
  Grapes?: string;
  Region?: string;
  "Wine style"?: string;
  Allergens?: string;
  "Alcohol content"?: string;
  "Wine description"?: string;
  data?: string;
}

export interface WineFlatData {
  "wineFacts.Wine Name"?: string;
  "wineFacts.Winery"?: string;
  "wineFacts.Grapes"?: string;
  "wineFacts.Region"?: string;
  "wineFacts.Wine style"?: string;
  "wineFacts.Allergens"?: string;
  wineryRating: number;
  "foodPairings.0": string;
  "foodPairings.1"?: string;
  "foodPairings.2"?: string;
  style: string;
  varietal: string;
  "style_stats.Description": string;
  "style_stats.Interesting Facts"?: string;
  "style_stats.Body Rating": number;
  "style_stats.Body Description": string;
  "style_stats.Acidity Rating": number;
  "style_stats.Acidity Description": string;
  "style_stats.BaseStats.acidity"?: number;
  "style_stats.BaseStats.fizziness"?: any;
  "style_stats.BaseStats.intensity"?: number;
  "style_stats.BaseStats.sweetness"?: number;
  "style_stats.BaseStats.tannin"?: number;
  "recommended_vintages.0.year"?: number;
  "recommended_vintages.0.type"?: string;
  "recommended_vintages.1.year"?: number;
  "recommended_vintages.1.type"?: string;
  image: string;
  "wineFacts.Alcohol content"?: string;
  "foodPairings.3"?: string;
  "style_stats.Interesting Facts.0"?: string;
  "recommended_vintages.2.year"?: number;
  "recommended_vintages.2.type"?: string;
  "recommended_vintages.3.year"?: number;
  "recommended_vintages.3.type"?: string;
  "wineFacts.Wine description"?: string;
  "style_stats.Interesting Facts.1"?: string;
  "style_stats.Interesting Facts.2"?: string;
  recommended_vintages?: string;
  "foodPairings.4"?: string;
  "style_stats.Interesting Facts.3"?: string;
  "style_stats.Interesting Facts.4"?: string;
  "recommended_vintages.4.year"?: number;
  "recommended_vintages.4.type"?: string;
  "recommended_vintages.5.year"?: number;
  "recommended_vintages.5.type"?: string;
  "wineFacts.data"?: string;
  "style_stats.BaseStats.Error"?: string;
  "recommended_vintages.year"?: number;
  "recommended_vintages.type"?: string;
  "recommended_vintages.6.year"?: number;
  "recommended_vintages.6.type"?: string;
  "recommended_vintages.7.year"?: number;
  "recommended_vintages.7.type"?: string;
}

// db conversion functions

// Define a generic function for stripping system fields from a response object
function stripSystemFields<T extends BaseSystemFields, R>(response: T): R {
  const { id, created, updated, collectionId, collectionName, ...record } =
    response;
  return record as R;
}

function transformFoodPairingsToStringArray(
  foodPairings: FoodPairingsRecord[]
): string[] {
  const validation = FoodPairingsRecordSchemaArray.safeParse(foodPairings);
  if (!validation.success) {
    throw new Error("Invalid food pairings data");
  }
  return validation.data.map((fp) => fp || "");
}

function transformStringArrayToFoodPairings(
  foodPairings: string[]
): FoodPairingsRecord[] {
  return foodPairings.map((fp) => ({ foodPairing: fp }));
}

function transformRecommendedvintageToString(
  recommendedvintage: RecommendedvintageRecord[]
): string {
  return JSON.stringify(recommendedvintage);
}

function transformStringToRecommendedvintage(
  recommendedvintage: string
): RecommendedvintageRecord[] {
  return JSON.parse(recommendedvintage);
}

function transformStylestatsToString(stylestats: StylestatsRecord): string {
  return JSON.stringify(stylestats);
}

function transformStringToStylestats(stylestats: string): StylestatsRecord {
  return JSON.parse(stylestats);
}

function transformWineFactsToString(wineFacts: WineFactsRecord): string {
  return JSON.stringify(wineFacts);
}

function transformStringToWineFacts(wineFacts: string): WineFactsRecord {
  return JSON.parse(wineFacts);
}

function transformWineInfoToString(wineInfo: WineInfoRecord): string {
  return JSON.stringify(wineInfo);
}

function transformStringToWineInfo(wineInfo: string): WineInfoRecord {
  return JSON.parse(wineInfo);
}

function transformBaseStatsToString(baseStats: BaseStatsRecord): string {
  return JSON.stringify(baseStats);
}

function transformStringToBaseStats(baseStats: string): BaseStatsRecord {
  return JSON.parse(baseStats);
}

export function validateWineType<T>(
  collectionString: string,
  data: T,
  responseFlag = false
): T {
  let collection: Collections;
  if (isValidCollection(collectionString)) {
    collection = collectionString as Collections;
  } else {
    throw new Error("Invalid collection");
  }

  if (responseFlag) {
    const schema = getZodResponseSchema(collection);
    if (!schema) throw new Error("No schema found");
    const returnObj: T = schema.parse(data) as T;
    // const returnObj: T = validation.success
    //   ? (validation.data as T)
    //   : ({} as T);
    return returnObj;
  } else {
    const schema = getZodSchema(collection);
    if (!schema) throw new Error("No schema found");
    const returnObj: T = schema.parse(data) as T;
    // const returnObj: T = validation.success
    //   ? (validation.data as T)
    //   : ({} as T);
    return returnObj;
  }
  return {} as T;
}

export async function validateZodSchema<T>(
  collection: Collections,
  data: T
): Promise<boolean> {
  const schema = getZodSchema(collection);
  try {
    if (!schema) throw new Error("No schema found");
    schema.parse(data);
    return true;
  } catch (error) {
    console.error(`Failed to validate data for ${collection}`, error);
    return false;
  }
}
export async function validateZodResponseSchema<T>(
  collection: Collections,
  data: T
): Promise<boolean> {
  const schema = getZodResponseSchema(collection);
  try {
    if (!schema) throw new Error("No schema found");
    schema.parse(data);
    return true;
  } catch (error) {
    console.error(`Failed to validate data for ${collection}`, error);
    return false;
  }
}
function getZodSchema(collection: Collections) {
  switch (collection) {
    case Collections.WineFacts:
      return WineFactsRecordSchema;
    case Collections.WineInfo:
      return WineInfoRecordSchema;
    case Collections.WineInfoData:
      return WineInfoDataRecordSchema;
    case Collections.WineInfoDataArray:
      return WineInfoDataRecordArraySchema;
    case Collections.FoodPairings:
      return FoodPairingsRecordSchema;
    case Collections.Users:
      return UsersRecordSchema;
    case Collections.Stylestats:
      return StylestatsRecordSchema;
    case Collections.Recommendedvintage:
      return RecommendedvintageRecordSchema;
    case Collections.InterestingFacts:
      return InterestingFactsRecordSchema;
    case Collections.BottlesDB:
      return BottlesDBRecordSchema;
    case Collections.BaseStats:
      return BaseStatsRecordSchema;
  }
  return null;
}

function getZodResponseSchema(collection: Collections) {
  switch (collection) {
    case Collections.WineFacts:
      return WineFactsResponseSchema;
    case Collections.WineInfo:
      return WineInfoResponseSchema;
    case Collections.WineInfoData:
      return WineInfoDataResponseSchema;
    case Collections.FoodPairings:
      return FoodPairingsResponseSchema;
    case Collections.Users:
      return UsersResponseSchema;
    case Collections.Stylestats:
      return StylestatsResponseSchema;
    case Collections.Recommendedvintage:
      return RecommendedvintageResponseSchema;
    case Collections.InterestingFacts:
      return InterestingFactsResponseSchema;
    case Collections.BottlesDB:
      return BottlesDBResponseSchema;
    case Collections.BaseStats:
      return BaseStatsResponseSchema;
  }
  return null;
}

export function getWineFacts(wid: WineInfoDataRecord): WineFacts {
  const returnObj = {
    "Wine Name": wid.WineName,
    wineName: wid.WineName,
    Winery: wid.Facts_winery,
    Grapes: wid.Facts_grapes,
    Region: wid.Facts_region,
    "Wine style": wid.Style,
    Allergens: wid.Facts_allergens,
    "Alcohol content": wid.Facts_alcohol_content,
    "Wine description": wid.Facts_wine_desc,
  };

  return validateWineType<WineFacts>(Collections.WineFacts, returnObj);
}

export function getFoodPairings(wid: WineInfoDataRecord): string[] {
  const returnArray = wid?.FoodPairings?.split(";").map((fp) => fp.trim());
  return returnArray || [];
}

export function getRecommendedVintages(wid: WineInfoDataRecord): string[] {
  const returnArray = wid?.Recommended_vintages?.split(";").map((rv) =>
    rv.trim()
  );
  return returnArray || [];
}

export function getInterestingFacts(wid: WineInfoDataRecord): string[] {
  const returnArray = wid?.Facts_interesting_facts?.split(";").map((rv) =>
    rv.trim()
  );
  return returnArray || [];
}

export async function convertFulltoWID(
  d: any,
  baseProtocol: string,
  locals: App.Locals,
  fetch: typeof window.fetch
): Promise<WineInfoDataRecord> {
  let resultObj: WineInfoDataRecord;
  if (!d.key || !d[d["key"] + "_data"] || !d[d["key"] + "_facts"] || !d.code)
    throw Error("Missing data");
  const code = d.code as string;
  const factsKey: WineFacts = d[d["key"] + "_facts"];
  const dataKey = d[d["key"] + "_data"]?.["wine"] ?? null;
  const styleKey = dataKey?.["style"] ?? null;
  const recommendedVintages =
    d[d["key"] + "_data"]?.["recommended_vintages"] ?? null;
  const imageLoc =
    d[d["key"] + "_data"]?.["vintage"]?.["image"]?.["location"] ?? "";
  try {
    validateData(dataKey, styleKey, recommendedVintages, imageLoc, code);
  } catch (error) {
    log.p("WineTypes.convertFulltoWID error", error);
    throw new Error(error as string);
  }
  let temp: WineInfoDataRecord = {} as WineInfoDataRecord;
  try {
    temp = await generateWineInfoDataRecord(
      factsKey,
      dataKey,
      styleKey,
      recommendedVintages,
      baseProtocol,
      imageLoc,
      locals,
      code,
      fetch
    );
    resultObj = validateWineType<WineInfoDataRecord>(
      "WineInfoData",
      temp as WineInfoDataRecord
    );
  } catch (error) {
    log.p("WineTypes.convertFulltoWID error", error);
    throw new Error(error as string);
  }
  // resultObj = validateWineType<WineInfoDataRecord>(
  //   "WineInfoData",
  //   temp as WineInfoDataRecord
  // );

  return resultObj;
}

async function generateWineInfoDataRecord(
  factsKey: any,
  dataKey: any,
  styleKey: any,
  recommendedVintages: any,
  baseProtocol: string,
  imageLoc: string,
  locals: App.Locals,
  code: string = "",
  fetch: typeof window.fetch
): Promise<WineInfoDataRecord> {
  // const returnObj = {} as WineInfoDataRecord;
  const wineFacts = mapFacts(factsKey);
  const wineryRating: number =
    dataKey["winery"]?.["statistics"]?.["ratings_average"] ?? 0;
  const foodPairings: string[] =
    dataKey["foods"]?.map((f: any) => f["name"]) ?? [];
  const style: string = styleKey ? styleKey?.["name"] : "N/A";
  const varietal: string = styleKey ? styleKey["varietal_name"] : "N/A";
  const styleStats = mapStyleStats(styleKey);
  const recommended_vintages = mapRecommendedVintages(recommendedVintages);
  const Image = baseProtocol + (imageLoc ?? "");
  const BaseStats_acidity = styleStats.BaseStats?.acidity ?? 0;
  const BaseStats_fizziness = styleStats.BaseStats?.fizziness ?? 0;
  const BaseStats_intensity = styleStats.BaseStats?.intensity ?? 0;
  const BaseStats_sweetness = styleStats.BaseStats?.sweetness ?? 0;
  const BaseStats_tannin = styleStats.BaseStats?.tannin ?? 0;
  const Facts_alcohol_content = wineFacts?.["Alcohol content"];
  const Facts_allergens = wineFacts?.["Allergens"];
  const Facts_grapes = wineFacts?.["Grapes"];
  const Facts_interesting_facts = Array.isArray(
    styleStats?.["Interesting Facts"]
  )
    ? styleStats?.["Interesting Facts"].join("; ")
    : styleStats?.["Interesting Facts"];
  const Facts_region = wineFacts?.["Region"];
  const Facts_wine_desc = styleStats?.["Description"];
  const Facts_winery = wineFacts?.["Winery"];
  const Facts_winery_rating = wineryRating;
  const FoodPairings = foodPairings.join("; ");
  const Recommended_vintages = Array.isArray(recommended_vintages)
    ? recommended_vintages.map((v) => `${v.year} - ${v.type}`).join("; ")
    : recommended_vintages;
  const Style = style;
  const StyleStats_acidity_desc = styleStats?.["Acidity Description"];
  const StyleStats_acidity_rating = styleStats?.["Acidity Rating"];
  const StyleStats_body_desc = styleStats?.["Body Description"];
  const StyleStats_body_rating = styleStats?.["Body Rating"];
  const Varietal = varietal;
  const WineName = wineFacts?.["Wine Name"];

  //handle FoodPairingLink array
  let FoodPairingLink: string[] = [];
  try {
    const foodPairs = await handleFoodPairChecks(foodPairings, locals, fetch);
    FoodPairingLink = foodPairs.map((f) => f[1]);
  } catch (error) {
    console.error("Failed to handle foodPairingLinks", error);
  }
  const newWineInfoData: WineInfoDataRecord = {
    Code: code,
    BaseStats_acidity,
    BaseStats_fizziness,
    BaseStats_intensity,
    BaseStats_sweetness,
    BaseStats_tannin,
    Facts_alcohol_content,
    Facts_allergens,
    Facts_grapes,
    Facts_interesting_facts,
    Facts_region,
    Facts_wine_desc,
    Facts_winery,
    Facts_winery_rating,
    FoodPairings,
    Image,
    Recommended_vintages,
    Style,
    StyleStats_acidity_desc,
    StyleStats_acidity_rating,
    StyleStats_body_desc,
    StyleStats_body_rating,
    Varietal,
    WineName,
    FoodPairingLink,
  };
  const checkSchema = await validateZodSchema<WineInfoDataRecord>(
    Collections.WineInfoData,
    newWineInfoData
  );
  p("newWineInfoData", newWineInfoData);
  p("checkSchema", checkSchema);

  if (!checkSchema) {
    throw new Error(`Invalid data for ${Collections.WineInfoData}`);
  }
  return newWineInfoData;
}
async function lookupFoodPairing(
  foodPairings: string[],
  locals: App.Locals,
  fetch: typeof window.fetch
): Promise<{ newFoods: string[]; existingFoods: [string, string][] }> {
  const response = await fetch(
    `http://localhost:5173/api/foodPairings?filter=foodPairing="${foodPairings.join('"||foodPairing="')}"`
  );
  if (!response.ok) {
    console.error("Failed to fetch foodPairings", await response.text());
    return { newFoods: [], existingFoods: [] };
  }
  const responseData = await response.json();
  // log.p("responseData", responseData);
  const existingFoods = new Map<string, string>(
    responseData.items.map((f: any) => {
      // log.p("f.id", f.id);
      // log.p("f.foodPairing", f.foodPairing);
      return [f.foodPairing, f.id];
    })
  );
  const newFoods = foodPairings.filter((f) => !existingFoods.has(f));
  return {
    newFoods: newFoods,
    existingFoods: Array.from(existingFoods.entries()),
  };
}
async function addFoodPairing(
  foodPairing: string,
  locals: App.Locals,
  fetch: typeof window.fetch
): Promise<[string, string]> {
  p("body", JSON.stringify({ foodPairing }));
  // p(
  //   "check",
  //   await validateZodSchema<FoodPairingsRecord>(Collections.FoodPairings, {
  //     foodPairing,
  //   })
  // );
  if (
    !(await validateZodSchema<FoodPairingsRecord>(Collections.FoodPairings, {
      foodPairing,
    }))
  ) {
    throw new Error(`Invalid data for ${Collections.FoodPairings}`);
  }
  const response = await fetch(`http://localhost:5173/api/foodPairings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foodPairing }),
  });
  if (!response.ok) {
    console.error("Failed to add foodPairing", await response.text());
    return ["", ""];
  }
  const responseData = await response.json();
  return [foodPairing, responseData.id];
  // return "test";
}

async function handleFoodPairChecks(
  foodPairings: string[],
  locals: App.Locals,
  fetch: typeof window.fetch
): Promise<[string, string][]> {
  let newLoadedFoods: [string, string][] = [];
  const { newFoods, existingFoods } = await lookupFoodPairing(
    foodPairings,
    locals,
    fetch
  );
  if (newFoods.length > 0) {
    newLoadedFoods = await Promise.all(
      newFoods.map((f) => addFoodPairing(f, locals, fetch))
    );
  }
  return newLoadedFoods.concat(existingFoods).filter((f) => f);
}
async function checkExistingCode(
  code: string,
  locals: App.Locals,
  fetch: typeof window.fetch
): Promise<{ check: boolean; id: string }> {
  const response = await fetch(
    `http://localhost:5173/api/WineInfoData?filter=Code="${code}"`
  );
  p("code response", response);
  if (!response.ok) {
    console.error("Error checking code", await response.text());
    return { check: true, id: "" };
  }
  const responseData = await response.json();
  p("code responseData", responseData);
  // log.p("responseData", responseData);
  return {
    check: responseData.items.length > 0,
    id: responseData?.items[0]?.id,
  };
  // );
  // const newFoods = foodPairings.filter((f) => !existingFoods.has(f));
}

function validateData(
  dataKey: any,
  styleKey: any,
  recommendedVintages: any,
  imageLoc: string,
  code?: string
): void {
  if (!dataKey || !recommendedVintages || !imageLoc) {
    const errorObj = {
      dataKey: dataKey ? "data exists" : "missing",
      styleKey: styleKey ? "style exists" : "missing",
      recommendedVintages: recommendedVintages ? "RVs exist" : "missing",
      imageLoc: imageLoc ? "image exists" : "missing",
      code: code ? code : "missing",
    };
    const errorString = "Missing data: " + JSON.stringify(errorObj, null, 2);
    throw Error(errorString);
  }
}

function mapFacts(factsKey: WineFacts): WineFacts {
  let facts: Partial<WineFacts> = {};
  Object.entries(factsKey).forEach(([key, value]) => {
    if (key === "wineName") {
      facts = { ...facts, ...{ "Wine Name": value } };
    } else facts = { ...facts, [key]: value };
  });
  return facts as WineFacts;
}

function mapRecommendedVintages(
  recommendedVintages: any
): Recommendedvintage[] | string {
  if (!recommendedVintages) return "N/A";
  if (recommendedVintages.length > 0) {
    return recommendedVintages.map(
      (v: any): Recommendedvintage => ({
        year: v?.["vintage"]?.["year"] ?? 1900,
        type: v?.["type"] ?? "N/A",
      })
    );
  }
  return "N/A";
}

function mapStyleStats(styleKey: any): Stylestats {
  if (!styleKey)
    return {
      Description: "N/A",
      "Interesting Facts": "N/A",
      "Body Rating": 0,
      "Body Description": "N/A",
      "Acidity Rating": 0,
      "Acidity Description": "N/A",
      BaseStats: {
        Error: "No baseline structure found",
      },
    };
  return {
    Description: styleKey?.["description"] ?? "N/A",
    "Interesting Facts": styleKey?.["interesting_facts"] ?? "N/A",
    "Body Rating": styleKey?.["body"] ?? 0,
    "Body Description": styleKey?.["body_description"] ?? "N/A",
    "Acidity Rating": styleKey?.["acidity"] ?? 0,
    "Acidity Description": styleKey?.["acidity_description"] ?? "N/A",
    BaseStats: styleKey?.["baseline_structure"] ?? {
      Error: "No baseline structure found",
    },
  };
}
export function keyCode(key: string) {
  const endIdx = key.lastIndexOf("_");
  return key.substring(endIdx + 1);
}
