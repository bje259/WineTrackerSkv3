import { z } from "zod";
import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
  BaseStats = "BaseStats",
  BottlesDB = "BottlesDB",
  InterestingFacts = "Interesting_Facts",
  Recommendedvintage = "Recommendedvintage",
  Stylestats = "Stylestats",
  WineFacts = "WineFacts",
  WineInfo = "WineInfo",
  WineInfoData = "WineInfoData",

  WineInfoDataArray = "WineInfoDataArray",
  FoodPairings = "foodPairings",
  Users = "users",
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

export type StylestatsRecord = {
  Acidity_Description?: string;
  Acidity_Rating?: number;
  BaseStats?: RecordIdString;
  Body_Description?: string;
  Body_Rating?: number;
  Description?: string;
  Interesting_Facts?: RecordIdString[];
};

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
export const UsersResponseSchema = UsersRecordSchema.extend(
  AuthSystemFieldsSchema.shape
);

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
