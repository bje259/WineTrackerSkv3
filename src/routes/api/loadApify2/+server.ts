import type { RequestHandler } from "./$types.d.ts";
import type {
  WineInfo,
  WineFacts,
  Stylestats,
  Recommendedvintage,
} from "$lib/index.js";
import type {
  WineFactsRecord,
  WineInfoRecord,
  WineInfoDataRecord,
  FoodPairingsRecord,
  StylestatsRecord,
  RecommendedvintageRecord,
  InterestingFactsRecord,
  BaseStatsRecord,
  RecordIdString,
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
} from "$lib/WineTypes.js";
import { p, pt } from "$lib/utils.js";

/*
 * datasetMappingFunction is a function that maps your Apify dataset format to LangChain documents.
 * In the below example, the Apify dataset format looks like this:
 * {
 *   "url": "https://apify.com",
 *   "text": "Apify is the best web scraping and automation platform."
 * }
 */

/*
  LangChain is a framework for developing applications powered by language models.
  [
    'https://js.langchain.com/docs/',
    'https://js.langchain.com/docs/modules/chains/',
    'https://js.langchain.com/docs/modules/chains/llmchain/',
    'https://js.langchain.com/docs/category/functions-4'
  ]
*/

/**
 * Handles GET requests to fetch and process wine data from Apify dataset.
 * @returns {Promise<Response>} JSON response with processed wine data.
 */

export const PATCH: RequestHandler = async ({
  locals,
  request,
  fetch,
}): Promise<Response> => {
  const body = await request.json();
  p("body", body);
  const collection = "WIneInfoData";
  const dataArray: WineInfoDataRecord[] = body;
  let response = null;
  dataArray.forEach(async (data) => {
    try {
      const checkSchema = await validateZodSchema<WineInfoDataRecord>(
        Collections.WineInfoData,
        data
      );
      // p("newWineInfoData", data);
      p("checkSchema", checkSchema);

      if (!checkSchema) {
        throw new Error(`Invalid data for ${Collections.WineInfoData}`);
      }
      if (!data.Code) {
        throw new Error("Missing Code");
      }
      const codeExists = await checkExistingCode(data.Code, locals, fetch);
      p("codeExists", codeExists);

      if (codeExists.check) {
        console.log(`Code already exists: ${data.Code}
    Updating record`);
        response = await fetch(
          `http://localhost:5173/api/WineInfoData/${codeExists.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      } else {
        response = await fetch(`http://localhost:5173/api/WineInfoData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }
      if (!response.ok) {
        console.error(
          "Failed to post data to WineInfoData",
          await response.text()
        );
        throw new Error("Failed to post data to WineInfoData");
      }
    } catch (error) {
      console.error("Error posting data to WineInfoData", error);
      return new Response(JSON.stringify({ success: false, message: error }), {
        status: 500,
      });
    }
    const responseData = await response.json();
    p("responseData", responseData);
  });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};

export const GET: RequestHandler = async ({ locals, fetch }) => {
  //debug switch
  const dbg = false;
  let response: any = undefined;
  // Fetch data from Apify dataset
  try {
    response = await fetchData(
      "https://api.apify.com/v2/datasets/LUjKSEKRJNBQZeRO8/items?clean=true&format=json"
    );
    if (!response.ok || response.status !== 200) {
      throw Error("Bad response");
    }
  } catch (error) {
    console.log(error);
  }
  const baseProtocol = "https:";
  let data: Partial<WineInfo>[] = [];
  let summaryData: WineInfo[] = [];
  try {
    if (response !== undefined) {
      data = await response.json();
    } else {
      throw Error("No response");
    }
  } catch (error) {
    console.log(error);
  }
  /////TEMP LIMIT DATA
  // data = data.slice(0, 5);
  //call process data for further processing
  if (Array.isArray(data) && data.length > 0) {
    summaryData = await Promise.all(
      data.map(async (d: any, idx: number): Promise<WineInfo> => {
        if (dbg) debugLog(d, idx);
        return await processData(d, baseProtocol, dbg, locals, fetch);
      })
    );
  }
  // let keymap = new Map<string>(data.map((d) => {key:d.key,code:d.code}));
  // p("data", data[0]);
  // const outputMap = data.map((d) => {
  // return {
  // code: d["code"],
  // name: d[d["key"] + "_facts"]["wineName"],
  // };
  // });

  // p("output map", outputMap);
  // const { foodPairings, wineFacts } = summaryData[0];
  // console.log("foodPairings", foodPairings);
  // console.log("wineFacts", wineFacts);
  //test schema validation
  // const testSchema = WineFactsRecordSchema;
  // const testSchema2 = FoodPairingsRecordSchema;
  // const checkSchema = await validateZodSchema<WineFactsRecord>(
  //   Collections.WineFacts,
  //   wineFacts
  // );
  // const checkSchema2 = await validateZodSchema<FoodPairingsRecord[]>(
  //   Collections.FoodPairings,
  //   foodPairings as FoodPairingsRecord[]
  // );
  // console.log("checkSchema", checkSchema);
  // console.log("checkSchema2", checkSchema2);

  return Response.json(summaryData);
};

function keyCode(key: string) {
  const endIdx = key.lastIndexOf("_");
  return key.substring(endIdx + 1);
}
/**
 * Fetches data from a given URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Response>} The fetched response.
 */
async function fetchData(url: string): Promise<Response> {
  return (await fetch(url)) as Response;
}

/**
 * Logs debug information for a given dataset entry.
 * @param {any} d - The dataset entry.
 * @param {number} idx - The index of the dataset entry.
 */
function debugLog(d: any, idx: number): void {
  p(`New Test!!! 
    ${idx + 1}`);
  p(
    "key",
    d["key"],
    "facts",
    d[d["key"] + "_facts"],
    "data",
    d[d["key"] + "_data"]?.["wine"] ?? null
  );
}

/**
 * Processes a single dataset entry into a WineInfo object.
 * @param {any} d - The dataset entry.
 * @param {string} baseProtocol - The base protocol for image URLs.
 * @param {boolean} dbg - Debug flag.
 * @returns {WineInfo} The processed WineInfo object.
 */
async function processData(
  d: any,
  baseProtocol: string,
  dbg: boolean,
  locals: App.Locals,
  fetch: typeof window.fetch
): Promise<WineInfo> {
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
    console.log("error", error);
    if (dbg) debugErrorLog(d, dataKey, styleKey, recommendedVintages, factsKey);
    return generateEmptyObject(code ? code : undefined);
  }
  //ph for updated PB data load
  try {
    if (dbg) p("code", code);
    await updatePBWID(
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
  } catch (error) {
    console.log("error", error);
  }
  // Generate WineInfo object

  return generateDataObject(
    factsKey,
    dataKey,
    styleKey,
    recommendedVintages,
    baseProtocol,
    imageLoc,
    locals,
    code
  );
}

/**
 * Validates the necessary fields in a dataset entry.
 * @param {any} dataKey - The data key of the entry.
 * @param {any} styleKey - The style key of the entry.
 * @param {any} recommendedVintages - The recommended vintages of the entry.
 * @param {string} imageLoc - The image location of the entry.
 */
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

/**
 * Logs error information when data processing fails.
 * @param {any} d - The dataset entry.
 * @param {any} dataKey - The data key of the entry.
 * @param {any} styleKey - The style key of the entry.
 * @param {any} recommendedVintages - The recommended vintages of the entry.
 * @param {any} factsKey - The facts key of the entry.
 */
function debugErrorLog(
  d: any,
  dataKey: any,
  styleKey: any,
  recommendedVintages: any,
  factsKey: any
): void {
  console.log("Key:", d.key);
  console.log("dataKey", dataKey);
  console.log("styleKey", styleKey);
  console.log("recommendedVintages", recommendedVintages);
  console.log("factsKey", factsKey);
  console.log("data", d);
}

/**
 * Generates an empty WineInfo object with default values.
 * @returns {WineInfo} The empty WineInfo object.
 */
function generateEmptyObject(code?: string): WineInfo {
  return {
    wineFacts: {
      data: "missing",
    },
    wineryRating: 0,
    code: code ?? "",
    foodPairings: [""],
    style: "",
    varietal: "",
    styleStats: {
      Description: "",
      "Interesting Facts": "",
      "Body Rating": 0,
      "Body Description": "",
      "Acidity Rating": 0,
      "Acidity Description": "",
      BaseStats: {
        Error: "No baseline structure found",
      },
    },
    recommended_vintages: "N/A",
    image: "",
  };
}

/**
 * Generates a WineInfo object from dataset entry fields.
 * @param {any} factsKey - The facts key of the entry.
 * @param {any} dataKey - The data key of the entry.
 * @param {any} styleKey - The style key of the entry.
 * @param {any} recommendedVintages - The recommended vintages of the entry.
 * @param {string} baseProtocol - The base protocol for image URLs.
 * @param {string} imageLoc - The image location of the entry.
 * @returns {WineInfo} The generated WineInfo object.
 */
async function generateDataObject(
  factsKey: any,
  dataKey: any,
  styleKey: any,
  recommendedVintages: any,
  baseProtocol: string,
  imageLoc: string,
  locals: App.Locals,
  code: string = ""
): Promise<WineInfo> {
  const wineFacts = mapFacts(factsKey);
  const wineryRating: number =
    dataKey["winery"]?.["statistics"]?.["ratings_average"] ?? 0;
  const foodPairings: string[] =
    dataKey["foods"]?.map((f: any) => f["name"]) ?? [];
  const style: string = styleKey ? styleKey?.["name"] : "N/A";
  // const code: string = dataKey?.["code"] ?? "N/A";
  const varietal: string = styleKey ? styleKey["varietal_name"] : "N/A";
  const styleStats = mapStyleStats(styleKey);
  const recommended_vintages = mapRecommendedVintages(recommendedVintages);
  const image = baseProtocol + (imageLoc ?? "");
  // await createDBRecords(
  //   wineFacts,
  //   wineryRating,
  //   foodPairings,
  //   style,
  //   varietal,
  //   styleStats,
  //   recommended_vintages,
  //   image,
  //   locals
  // );
  return {
    wineFacts: wineFacts,
    wineryRating: wineryRating,
    foodPairings: foodPairings,
    style: style,
    code: code,
    varietal: varietal,
    styleStats: styleStats,
    recommended_vintages: recommended_vintages,
    image: image,
  };
}

// async function postPBData<T>(
//   collection: Collections,
//   data: Partial<T>,
//   locals: App.Locals
// ): Promise<{ success: boolean; ids?: string[]; id?: string }> {
//   p("Start of post Function", data);
//   debugger;
//   if (Array.isArray(data)) {
//     const ids = await Promise.all(
//       data.map(async (d) => {
//         if (d) {
//           let result: { success: boolean; id?: string } = { success: false };
//           try {
//             result = await postPBData(collection, d, locals);
//             if (!result.success) {
//               console.error(`Failed to post data to ${collection}`);
//             }
//             return result.id;
//           } catch (error) {
//             console.error(`Failed to post data to ${collection}`, error);
//           }
//           return result.id;
//         }
//       })
//     );
//     return {
//       success: true,
//       ids: ids.filter((id) => id !== undefined) as string[],
//     };
//   }

//   try {
//     const response = await fetch(`http://localhost:5173/api/${collection}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       // Handle non-2xx responses as unsuccessful
//       console.error("Failed to post data", await response.text());
//       return { success: false };
//     }
//     const responseData = await response.json();
//     // Assuming the ID is returned under a property named 'id'
//     p(responseData, "response data");
//     const id = responseData.id;
//     return { success: true, id };
//   } catch (error) {
//     console.error("Error posting data", error);
//     return { success: false };
//   }
// }

async function validateZodSchema<T>(
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
  return true;
}

function getZodSchema(collection: Collections) {
  switch (collection) {
    case Collections.WineFacts:
      return WineFactsRecordSchema;
    case Collections.WineInfo:
      return WineInfoRecordSchema;
    case Collections.WineInfoData:
      return WineInfoDataRecordSchema;
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

// async function createDBRecords(
//   wineFacts: WineFactsRecord,
//   wineryRating: number,
//   foodPairings: string[],
//   style: string,
//   varietal: string,
//   styleStats: Stylestats,
//   recommended_vintages: Recommendedvintage[] | string,
//   image: string,
//   locals: App.Locals
// ): Promise<void> {
//   p("checking locals", locals.pb.authStore);
//   try {
//     if (!locals.pb.authStore.isValid) {
//       throw new Error("Unauthorized");
//     }
//   } catch (e: any) {
//     // if (e.status === 401) throw redirect(303, "/login");
//     // else throw error(500, e);
//     console.log("error!!!!!!!!!!", e);
//   }
//   const wineInfo: WineInfo = {
//     wineFacts,
//     wineryRating,
//     foodPairings,
//     style,
//     varietal,
//     styleStats,
//     recommended_vintages,
//     image,
//   };
//   /*
//     Order of processing and substitutions
//     1. WineFacts
//     2. BaseStats
//     3. InterestingFacts
//     4. Recommendedvintage
//     5. Stylestats - Use BaseStatsID and InterestingFactsID
//     6. FoodPairings
//     7. WineInfo - Use FoodPairingsID, RecommendedvintageID, StylestatsID, WineFactsID
// }*/
//   try {
//     const arrayOrder = {
//       WineFacts: 1,
//       BaseStats: 2,
//       InterestingFacts: 3,
//       Recommendedvintage: 4,
//       Stylestats: 5,
//       FoodPairings: 6,
//       WineInfo: 7,
//     };
//     const dataPrep = Object.entries(wineInfo).map(([key, value]) => {
//       const collection = key as Collections;
//       const order = arrayOrder[key as keyof typeof arrayOrder];
//       const data = { [key]: value };
//       return { collection, data, order };
//     });
//     let WineResponses: any[] = [];

//     dataPrep.sort((a, b) => a.order - b.order);
//     WineResponses = dataPrep.map(async ({ collection, data }) => {
//       console.log("collection", collection);
//       let BaseStatsID = "";
//       let InterestingFactsIDs = [""];
//       let FoodPairingsIDs = [""];
//       let WineFactsID = "";
//       let RecommendedvintageIDs = [""];
//       let StylestatsID = "";

//       if (collection === "WineFacts") {
//         if (!validateZodSchema<WineFactsRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         const response = await postPBData<WineFactsRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         WineFactsID = response?.id ?? "";
//         return {
//           [collection]: WineFactsID,
//         };
//       }
//       if (collection === "BaseStats") {
//         if (!validateZodSchema<BaseStatsRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         const response = await postPBData<BaseStatsRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         BaseStatsID = response?.id ?? "";
//         return {
//           [collection]: BaseStatsID,
//         };
//       }
//       if (collection === "Interesting_Facts") {
//         if (!validateZodSchema<InterestingFactsRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         const response = await postPBData<InterestingFactsRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         InterestingFactsIDs = response?.ids ?? [];
//         return {
//           [collection]: InterestingFactsIDs,
//         };
//       }
//       if (collection === "Recommendedvintage") {
//         if (!validateZodSchema<RecommendedvintageRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         const response = await postPBData<RecommendedvintageRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         RecommendedvintageIDs = response?.ids ?? [];
//         return {
//           [collection]: RecommendedvintageIDs,
//         };
//       }
//       if (collection === "Stylestats") {
//         if (!validateZodSchema<StylestatsRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         data["BaseStats"] = BaseStatsID;
//         data["Interesting_Facts"] = InterestingFactsIDs;
//         data["FoodPairings"] = FoodPairingsIDs;
//         data["WineFacts"] = WineFactsID;
//         data["Recommendedvintage"] = RecommendedvintageIDs;
//         const response = await postPBData<StylestatsRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         StylestatsID = response?.id ?? "";
//         return {
//           [collection]: StylestatsID,
//         };
//       }
//       if (collection === "foodPairings") {
//         if (!validateZodSchema<FoodPairingsRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         const response = await postPBData<FoodPairingsRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         FoodPairingsIDs = response?.ids ?? [];
//         return {
//           [collection]: FoodPairingsIDs,
//         };
//       }
//       if (collection === "WineInfo") {
//         if (!validateZodSchema<WineInfoRecord>(collection, data)) {
//           throw new Error(`Invalid data for ${collection}`);
//         }
//         data["WineFacts"] = WineFactsID;
//         data["BaseStats"] = BaseStatsID;
//         data["Interesting_Facts"] = InterestingFactsIDs;
//         data["Recommendedvintage"] = RecommendedvintageIDs;
//         data["Stylestats"] = StylestatsID;
//         data["FoodPairings"] = FoodPairingsIDs;
//         const response = await postPBData<WineInfoRecord>(
//           collection,
//           data,
//           locals
//         );
//         if (!response.success) {
//           console.error(`Failed to post data to ${collection}`);
//         }
//         return {
//           [collection]: response?.id,
//         };
//       }

//       return {};
//     });
//     // WineResponses = dataPrep.map(async ({ collection, data }) => {
//     //   console.log("collection", collection);
//     //   let BaseStatsID = "";
//     //   let InterestingFactsIDs = [""];
//     //   let FoodPairingsIDs = [""];
//     //   let WineFactsID = "";
//     //   let RecommendedvintageIDs = [""];
//     //   let StylestatsID = "";
//     // });
//     const wineInfoIdMapping: Record<string, string | string[]> = Object.assign(
//       {},
//       ...WineResponses
//     );
//     if (Object.entries(wineInfoIdMapping["FoodPairings"]).length < 2) {
//       console.log("FoodPairings not found");
//       wineInfoIdMapping["FoodPairings"] = ["N/A", ""];
//     }

//     console.log(WineResponses);
//     const wineInfoRecord: WineInfoRecord = {
//       foodPairings: [...wineInfoIdMapping["FoodPairings"]],
//       image: image as string,
//       recommended_vintages: [...wineInfoIdMapping["Recommended_Vintages"]],
//       style: style as string,
//       stylestats: wineInfoIdMapping["Stylestats"] as string,
//       wineFacts: wineInfoIdMapping["WineFacts"] as string,
//       wineryRating: wineryRating as number,
//     };
//     const response = await postPBData<WineInfoRecord>(
//       Collections.WineInfo,
//       wineInfoRecord,
//       locals
//     );
//     if (!response.success) {
//       throw new Error("Failed to post data to WineInfo");
//     }
//   } catch (error) {
//     console.error("Failed to create DB records", error);
//   }
// }

/**
 * Maps facts from a dataset entry to a WineFacts object.
 * @param {WineFacts} factsKey - The facts key of the entry.
 * @returns {WineFacts} The mapped WineFacts object.
 */
function mapFacts(factsKey: WineFacts): WineFacts {
  let facts: Partial<WineFacts> = {};
  Object.entries(factsKey).forEach(([key, value]) => {
    if (key === "wineName") {
      facts = { ...facts, ...{ "Wine Name": value } };
    } else facts = { ...facts, [key]: value };
  });
  return facts as WineFacts;
}

/**
 * Maps style stats from a dataset entry to a Stylestats object.
 * @param {any} styleKey - The style key of the entry.
 * @returns {Stylestats} The mapped Stylestats object.
 */
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

/**
 * Maps recommended vintages from a dataset entry to an array or a default string.
 * @param {any} recommendedVintages - The recommended vintages of the entry.
 * @returns {Recommendedvintage[] | string} The mapped recommended vintages or a default string.
 */

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

async function updatePBWID(
  factsKey: any,
  dataKey: any,
  styleKey: any,
  recommendedVintages: any,
  baseProtocol: string,
  imageLoc: string,
  locals: App.Locals,
  code: string = "",
  fetch: typeof window.fetch
): Promise<void> {
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
  const codeExists = await checkExistingCode(code, locals, fetch);
  p("codeExists", codeExists);
  let response = null;
  if (codeExists.check) {
    console.log(`Code already exists: ${code}
    Updating record`);
    response = await fetch(
      `http://localhost:5173/api/WineInfoData/${codeExists.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWineInfoData),
      }
    );
  } else {
    response = await fetch(`http://localhost:5173/api/WineInfoData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWineInfoData),
    });
  }
  if (!response.ok) {
    console.error("Failed to post data to WineInfoData", await response.text());
    return;
  }
  const responseData = await response.json();
  p("responseData", responseData);

  // await createDBRecords(
  //   wineFacts,
  //   wineryRating,
  //   foodPairings,
  //   style,
  //   varietal,
  //   styleStats,
  //   recommended_vintages,
  //   image,
  //   locals
  // );
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
  // console.log("responseData", responseData);
  const existingFoods = new Map<string, string>(
    responseData.items.map((f: any) => {
      // console.log("f.id", f.id);
      // console.log("f.foodPairing", f.foodPairing);
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
  // console.log("responseData", responseData);
  return {
    check: responseData.items.length > 0,
    id: responseData?.items[0]?.id,
  };
  // );
  // const newFoods = foodPairings.filter((f) => !existingFoods.has(f));
}

//https://api.apify.com/v2/datasets/aelOgeNR3mHjk8CjR/items?clean=true&format=json&limit=1
// console.log(response);
// const loader = new ApifyDatasetLoader('', {
// 	datasetMappingFunction: (item) =>
// 		new Document({
// 			pageContent: (JSON.stringify(item) || '') as string,
// 			metadata: { source: item.url }
// 		}),
// 	clientOptions: {
// 		token: 'your-apify-token' // Or set as process.env.APIFY_API_TOKEN
// 	}
// });

// const docs = await loader.load();

// const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

// const model = new OpenAI({
// 	temperature: 0
// });

// const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
// 	returnSourceDocuments: true
// });

// const res = await chain.call({ query: 'What is LangChain?' });

// console.log(res.text);
// console.log(res.sourceDocuments.map((d: Document) => d.metadata.source));
