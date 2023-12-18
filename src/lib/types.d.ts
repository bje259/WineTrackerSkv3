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
 * const myWine: Wine = {
 * 	"Wine Name": "Margaux 2015",
 * 	"Vineyard Location": "Bordeaux, France",
 * 	Variety: "Cabernet Sauvignon",
 * 	Vintage: 2015,
 * 	Bin: "A1",
 * 	Qty: 10,
 * 	Purchased: "2020-01-01",
 * 	Notes: "Excellent vintage"
 * };
 * console.log(myWine);
 * // Output:
 * // {
 * // 	"Wine Name": "Margaux 2015",
 * // 	"Vineyard Location": "Bordeaux, France",
 * // 	Variety: "Cabernet Sauvignon",
 * // 	Vintage: 2015,
 * // 	Bin: "A1",
 * // 	Qty: 10,
 * // 	Purchased: "2020-01-01",
 * // 	Notes: "Excellent vintage"
 * // }
 */
export interface Wine {
	'Wine Name': string;
	'Vineyard Location'?: string;
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
	'Wine Name': string;
	'Vineyard Location'?: string;
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
	'Wine Name'?: SearchParam;
	'Vineyard Location'?: SearchParam;
	Variety?: SearchParam;
	Notes?: SearchParam;
	Vintage?: SearchParam;
	Bin?: SearchParam;
	Purchased?: SearchParam;
	Qty?: SearchParam;
	SearchTerm?: SearchParam;
}

export interface Bottle {
	Id: number;
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
 * @property {number} Id - The id of the bottle.
 * @property {string} Producer - The name of the producer.
 * @property {string} Name - The name of the wine.
 * @property {number} Vintage - The vintage of the wine.
 * @property {string} Purchased - The date when the wine was purchased.
 * @property {string} Consumed - (Optional) The date when the wine was consumed.
 * @see TBottles
 * @see Bottles
 */
export interface TBottle {
	Id: number;
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
