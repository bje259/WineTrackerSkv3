import type { RequestHandler } from "./$types.d.ts";
import { ApifyDatasetLoader } from "langchain/document_loaders/web/apify_dataset";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { Document } from "@langchain/core/documents";
import fs from "fs";
import type {
  WineData,
  WineInfo,
  WineFacts,
  Stylestats,
  Recommendedvintage,
  BaseStats,
} from "$lib/index.js";
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
export const GET: RequestHandler = async () => {
  const dbg = false;
  let response: any = undefined;
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
  let data: Partial<WineData>[] = [];
  let summaryData: WineData[] = [];
  try {
    if (response !== undefined) {
      data = await response.json();
    } else {
      throw Error("No response");
    }
  } catch (error) {
    console.log(error);
  }

  if (Array.isArray(data) && data.length > 0) {
    summaryData = data.map((d: any, idx: number): WineData => {
      if (dbg) debugLog(d, idx);
      return processData(d, baseProtocol, dbg);
    });
  }
  return Response.json(summaryData);
};

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
 * Processes a single dataset entry into a WineData object.
 * @param {any} d - The dataset entry.
 * @param {string} baseProtocol - The base protocol for image URLs.
 * @param {boolean} dbg - Debug flag.
 * @returns {WineData} The processed WineData object.
 */
function processData(d: any, baseProtocol: string, dbg: boolean): WineData {
  if (!d.key || !d[d["key"] + "_data"] || !d[d["key"] + "_facts"])
    throw Error("Missing data");
  const factsKey: WineFacts = d[d["key"] + "_facts"];
  const dataKey = d[d["key"] + "_data"]?.["wine"] ?? null;
  const styleKey = dataKey?.["style"] ?? null;
  const recommendedVintages =
    d[d["key"] + "_data"]?.["recommended_vintages"] ?? null;
  const imageLoc =
    d[d["key"] + "_data"]?.["vintage"]?.["image"]?.["location"] ?? "";
  try {
    validateData(dataKey, styleKey, recommendedVintages, imageLoc);
  } catch (error) {
    console.log("error", error);
    if (dbg) debugErrorLog(d, dataKey, styleKey, recommendedVintages, factsKey);
    return generateEmptyObject();
  }
  return generateDataObject(
    factsKey,
    dataKey,
    styleKey,
    recommendedVintages,
    baseProtocol,
    imageLoc
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
  imageLoc: string
): void {
  if (!dataKey || !styleKey || !recommendedVintages || !imageLoc)
    throw Error("Missing data");
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
 * Generates an empty WineData object with default values.
 * @returns {WineData} The empty WineData object.
 */
function generateEmptyObject(): WineData {
  return {
    wineFacts: {
      data: "missing",
    },
    wineryRating: 0,
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
 * Generates a WineData object from dataset entry fields.
 * @param {any} factsKey - The facts key of the entry.
 * @param {any} dataKey - The data key of the entry.
 * @param {any} styleKey - The style key of the entry.
 * @param {any} recommendedVintages - The recommended vintages of the entry.
 * @param {string} baseProtocol - The base protocol for image URLs.
 * @param {string} imageLoc - The image location of the entry.
 * @returns {WineData} The generated WineData object.
 */
function generateDataObject(
  factsKey: any,
  dataKey: any,
  styleKey: any,
  recommendedVintages: any,
  baseProtocol: string,
  imageLoc: string
): WineData {
  return {
    wineFacts: mapFacts(factsKey),
    wineryRating: dataKey["winery"]?.["statistics"]?.["ratings_average"] ?? 0,
    foodPairings: dataKey["foods"]?.map((f: any) => f["name"]) ?? [],
    style: styleKey ? styleKey?.["name"] : "N/A",
    varietal: styleKey ? styleKey["varietal_name"] : "N/A",
    styleStats: mapStyleStats(styleKey),
    recommended_vintages: mapRecommendedVintages(recommendedVintages),
    image: baseProtocol + (imageLoc ?? ""),
  };
}

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
