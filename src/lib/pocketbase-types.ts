/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";
import { z } from "zod";

export enum Collections {
  AppRoles = "AppRoles",
  BaseStats = "BaseStats",
  BottlesDB = "BottlesDB",
  InterestingFacts = "Interesting_Facts",
  Recommendedvintage = "Recommendedvintage",
  Stylestats = "Stylestats",
  UserRole = "UserRole",
  UserRoleAssignments = "UserRoleAssignments",
  UserRoleMap = "UserRoleMap",
  WineFacts = "WineFacts",
  WineInfo = "WineInfo",
  WineInfoData = "WineInfoData",
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
});

export const FoodPairingsRecordSchema = z.object({
  foodPairing: z.string().optional(),
});

export const FoodPairingsRecordSchemaArray = z.array(FoodPairingsRecordSchema);

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
