/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  loginUserDto,
  registerUserDto,
  userDB,
  bottleSchema,
  crudSchema,
  exportSchema,
  bottleRecordSchema,
} from "$lib/Schemas";
import { z } from "zod";
import { bottleRecordTableSchema } from "./Schemas";

export type UserDB = z.infer<typeof userDB>;
export type User = UserDB;
export type BottleDB = z.infer<typeof crudSchema>;
export type BottleDBinput = z.input<typeof crudSchema>;
export type BottlesDB = BottleDB[];
export type ExportSchema = Z.infer<typeof exportSchema>;

export type BottleRecordSchema = z.infer<typeof bottleRecordSchema>;
export type BottleRecordsSchema = BottleRecordSchema[];

/**
 * The Wine interface represents a wine.
 * @property {string} "Wine Name" - The name of the wine.
 * @property {string} "Vineyard Location" (Optional) - The producer of the wine.
 * @property {string} Variety - (Optional) The variety of the wine.
 * @property {number} Vintage - The vintage of the wine.
 * @property {string} Bin - (Optional) The bin where the wine is stored.
 * @property {number} Qty - The quantity of the wine.
 * @property {string} Purchased - (Optional) The date when the wine was purchased.
 * @property {string} Notes - (Optional) Any notes about the wine.
 * The Wine interface is used by the WineCellar class.
 * @see WineCellar
 * @example
 */
export interface Wine {
  "Wine Name": string;
  "Vineyard Location"?: string;
  Variety?: string;
  Vintage: number;
  Bin?: string;
  Qty: number;
  Purchased?: string;
  Notes?: string;
}
/**
 * Cellar interface represents a wine cellar.
 * The key is the name of the producer and the value is an array of Wine objects.
 * @property {string} producer - The name of the producer.
 * @property {Wine[]} wines - An array of Wine objects.
 * Reminder: Wine has these properties:
 * @property {string} "Wine Name" - The name of the wine.
 * @property {string} "Vineyard Location" (Optional) - The producer of the wine.
 * @property {string} Variety - (Optional) The variety of the wine.
 * @property {number} Vintage - (Optional) The vintage of the wine.
 * @property {string} Bin - (Optional) The bin where the wine is stored.
 * @property {number} Qty - The quantity of the wine.
 * @property {string} Purchased - (Optional) The date when the wine was purchased.
 * @property {string} Notes - (Optional) Any notes about the wine.
 * This structure allows for efficient lookup and manipulation of wines in the cellar.
 * The Cellar interface is used by the WineCellar class.
 * @see WineCellar
 */
export interface Cellar {
  [Producer: string]: Wine[];
}

export type CellarFlat = WineFlat[];
/**
 * WineFlat interface represents a flattened wine object
 * @property {string} Producer - The name of the producer.
 * @property {string} "Wine Name" - The name of the wine.
 * @property {string} "Vineyard Location" (Optional) - The producer of the wine.
 * @property {string} Variety - (Optional) The variety of the wine.
 * @property {InvItem[]} Inventory - An array of InvItem objects.
 * @property {string} Notes - (Optional) Any notes about the wine.
 * Note InvItem has these properties:
 * @see {number} Vintage -  The vintage of the wine.
 * @see {string} Bin - The bin where the wine is stored.
 * @see {number} Qty - The quantity of the wine.
 * @see {string} Purchased - (Optional) The date when the wine was purchased.
 * The WineFlat interface is used by the WineCellarFlat class.
 * @see WineCellarFlatt
 */
export interface WineFlat {
  Producer: string;
  "Wine Name": string;
  "Vineyard Location"?: string;
  Variety?: string;
  Inventory: InvItem[];
  Notes?: string;
}

/**
 * InvItem interface represents a wine inventory item.
 * @property {number} Vintage - The vintage of the wine.
 * @property {string} Bin - The bin where the wine is stored.
 * @property {number} Qty - The quantity of the wine.
 * @property {string} Purchased - (Optional) The date when the wine was purchased.
 * The InvItem interface is used by the WineFlat interface.
 * @see WineFlat
 */
export interface InvItem {
  Vintage: number;
  Bin: string;
  Purchased?: string;
  Qty: number;
}

/**
 * SearchParam interface represents a search parameter.
 * @property {boolean} isActive - Indicates if the search parameter is active.
 * @property {string | number} value - The value of the search parameter.
 * The SearchParam interface is used by the SearchParams interface.
 * @see SearchParams
 */
export interface SearchParam {
  isActive: boolean;
  value: string | number;
}

/**
 * SearchParams interface represents the search parameters.
 * @property {SearchParam} Producer - The name of the producer.
 * @property {SearchParam} "Wine Name" - The name of the wine.
 * @property {SearchParam} "Vineyard Location" (Optional) - The producer of the wine.
 * @property {SearchParam} Variety - (Optional) The variety of the wine.
 * @property {SearchParam} Notes - (Optional) Any notes about the wine.
 * @property {SearchParam} Vintage - The vintage of the wine.
 * @property {SearchParam} Bin - (Optional) The bin where the wine is stored.
 * @property {SearchParam} Purchased - (Optional) The date when the wine was purchased.
 * @property {SearchParam} Qty - The quantity of the wine.
 * @property {SearchParam} SearchTerm - The search term.
 * The SearchParams interface is used by the WineCellar class.
 * @see WineCellar
 */
export interface SearchParams {
  Producer?: SearchParam;
  "Wine Name"?: SearchParam;
  "Vineyard Location"?: SearchParam;
  Variety?: SearchParam;
  Notes?: SearchParam;
  Vintage?: SearchParam;
  Bin?: SearchParam;
  Purchased?: SearchParam;
  Qty?: SearchParam;
  SearchTerm?: SearchParam;
}

export interface Bottle {
  id: number;
  Producer: string;
  Name: string;
  Varietal: string;
  Vintage: number;
  VineyardLoc: string;
  VineyardName: string;
  Bin: string;
  Purchased: string;
  Consumed?: string;
  Notes: string;
}

/**
 * @description Test Bottle interface
 * @interface TBottle
 * @property {number} id - The id of the bottle.
 * @property {string} Producer - The name of the producer.
 * @property {string} Name - The name of the wine.
 * @property {number} Vintage - The vintage of the wine.
 * @property {string} Purchased - The date when the wine was purchased.
 * @property {string} Consumed - (Optional) The date when the wine was consumed.
 * @see TBottles
 * @see Bottles
 */
export interface TBottle {
  id: number;
  Producer: string;
  Name: string;
  Vintage: number;
  Purchased: string;
  Consumed: string;
}

export type TBottles = TBottle[];

export type Bottles = Bottle[];

export interface ShowBottleFields {
  Producer: boolean;
  Name: boolean;
  Varietal: boolean;
  Vintage: boolean;
  VineyardLoc: boolean;
  VineyardName: boolean;
  Bin: boolean;
  Purchased: boolean;
  Consumed: boolean;
  Notes: boolean;
}

interface LoginActionData {
  data?: LoginUserDto;
  errors?: z.inferFlattenedErrors<typeof registerUserDto>["fieldErrors"];
  notVerified?: boolean;
  invalidCredentials?: boolean;
}

export interface Admin {
  id?: string;
  email?: string;
  password?: string;
  verified?: boolean;
  created?: string;
  updated?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IndexRecord<T extends Record<string, any>> = {
  [key: string]: string | number | undefined;
} & T;

export interface RequiredBottleFields {
  Name: string;
  Producer: string;
  Vintage: number;
  created: string;
  updated: string;
  BottleId: string;
}

export type BottleRecordTableSchema = IndexRecord<RequiredBottleFields> & {
  Purchased?: string;
  Consumed?: string;
  id?: string;
  Varietal?: string;
  VineyardLoc?: string;
  VineyardName?: string;
  Bin?: string;
  Notes?: string;
  UserId?: string;
};

export type BottleRecordsTableSchema = BottleRecordTableSchema[];

// export interface WineData {
//   wineFacts: Record<string, any>;
//   wineryRating: number;
//   foodPairings: string[];
//   style: string;
//   varietal: string;
//   style_stats: {
//     description: string;
//     interestingFacts: string;
//     bodyRating: number;
//     bodyDesc: string;
//     acidityRating: number;
//     acidityDesc: string;
//     BaseStats: Record<string, number>;
//   };
//   recommended_vintages: { year: number; type: string }[] | string;
//   image: string;
// }

// export interface WineInfo {
//   wineFacts: WineFacts;
//   wineryRating: number;
//   foodPairings: string[];
//   style: string;
//   varietal: string;
//   style_stats: Stylestats;
//   recommended_vintages: Recommendedvintage[] | Recommendedvintage | string;
//   image: string;
// }

// export interface Recommendedvintage {
//   year: number;
//   type: string;
// }

// export interface Stylestats {
//   Description: string;
//   "Interesting Facts": string[] | string;
//   "Body Rating": number;
//   "Body Description": string;
//   "Acidity Rating": number;
//   "Acidity Description": string;
//   BaseStats: BaseStats;
// }

// export interface BaseStats {
//   acidity?: number;
//   fizziness?: any;
//   intensity?: number;
//   sweetness?: number;
//   tannin?: number;
//   Error?: string;
// }

// export interface WineFacts {
//   "Wine Name"?: string;
//   Winery?: string;
//   Grapes?: string;
//   Region?: string;
//   "Wine style"?: string;
//   Allergens?: string;
//   "Alcohol content"?: string;
//   "Wine description"?: string;
//   data?: string;
// }

// interface WineFlatData {
//   "wineFacts.Wine Name"?: string;
//   "wineFacts.Winery"?: string;
//   "wineFacts.Grapes"?: string;
//   "wineFacts.Region"?: string;
//   "wineFacts.Wine style"?: string;
//   "wineFacts.Allergens"?: string;
//   wineryRating: number;
//   "foodPairings.0": string;
//   "foodPairings.1"?: string;
//   "foodPairings.2"?: string;
//   style: string;
//   varietal: string;
//   "style_stats.Description": string;
//   "style_stats.Interesting Facts"?: string;
//   "style_stats.Body Rating": number;
//   "style_stats.Body Description": string;
//   "style_stats.Acidity Rating": number;
//   "style_stats.Acidity Description": string;
//   "style_stats.BaseStats.acidity"?: number;
//   "style_stats.BaseStats.fizziness"?: any;
//   "style_stats.BaseStats.intensity"?: number;
//   "style_stats.BaseStats.sweetness"?: number;
//   "style_stats.BaseStats.tannin"?: number;
//   "recommended_vintages.0.year"?: number;
//   "recommended_vintages.0.type"?: string;
//   "recommended_vintages.1.year"?: number;
//   "recommended_vintages.1.type"?: string;
//   image: string;
//   "wineFacts.Alcohol content"?: string;
//   "foodPairings.3"?: string;
//   "style_stats.Interesting Facts.0"?: string;
//   "recommended_vintages.2.year"?: number;
//   "recommended_vintages.2.type"?: string;
//   "recommended_vintages.3.year"?: number;
//   "recommended_vintages.3.type"?: string;
//   "wineFacts.Wine description"?: string;
//   "style_stats.Interesting Facts.1"?: string;
//   "style_stats.Interesting Facts.2"?: string;
//   recommended_vintages?: string;
//   "foodPairings.4"?: string;
//   "style_stats.Interesting Facts.3"?: string;
//   "style_stats.Interesting Facts.4"?: string;
//   "recommended_vintages.4.year"?: number;
//   "recommended_vintages.4.type"?: string;
//   "recommended_vintages.5.year"?: number;
//   "recommended_vintages.5.type"?: string;
//   "wineFacts.data"?: string;
//   "style_stats.BaseStats.Error"?: string;
//   "recommended_vintages.year"?: number;
//   "recommended_vintages.type"?: string;
//   "recommended_vintages.6.year"?: number;
//   "recommended_vintages.6.type"?: string;
//   "recommended_vintages.7.year"?: number;
//   "recommended_vintages.7.type"?: string;
// }
