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

export const GET: RequestHandler = async () => {
  const dbg = false;
  let response: any = undefined;
  //current data is stored on apify, will adjust when the data is moved to pocketbase
  try {
    response = (await fetch(
      "https://api.apify.com/v2/datasets/LUjKSEKRJNBQZeRO8/items?clean=true&format=json"
    )) as Response;
  } catch (error) {
    console.log(error);
  }
  const baseProtocol = "https:";
  let data: WineData[] = [];
  let summaryData: WineData[] = [];
  try {
    // const dataTemp = await response.json();
    if (response !== undefined) {
      data = await response.json();
    } else {
      throw Error("No response");
    }
  } catch (error) {
    console.log(error);
  }

  if (Array.isArray(data) && data.length > 0) {
    summaryData = data.map((d: any, idx: number) => {
      if (dbg) {
        //debug console.logs
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
      //validation checks
      if (!d.key || !d[d["key"] + "_data"] || !d[d["key"] + "_facts"])
        throw Error("Missing data");
      //shortcuts variables
      const factsKey = d[d["key"] + "_facts"];
      const dataKey = d[d["key"] + "_data"]?.["wine"] ?? null;
      const styleKey = dataKey?.["style"] ?? null;
      const recommendedVintages =
        d[d["key"] + "_data"]?.["recommended_vintages"] ?? null;
      const imageLoc =
        d[d["key"] + "_data"]?.["vintage"]?.["image"]?.["location"] ?? "";
      try {
        if (!dataKey) throw Error("Missing dataKey");
        if (!styleKey) throw Error("Missing styleKey");
        if (!recommendedVintages) throw Error("Missing recommendedVintages");
        if (!imageLoc) throw Error("Missing imageLoc");
      } catch (error) {
        console.log("error", error);
        if (dbg) {
          console.log("Key:", d.key);
          // console.log('server load', JSON.stringify(d, null, 2));
          console.log("dataKey", dataKey);
          console.log("styleKey", styleKey);
          console.log("recommendedVintages", recommendedVintages);
          console.log("factsKey", factsKey);
          console.log("data", d);
        }
        //return empty object if error, so other loads can continue
        return {
          wineFacts: {
            data: "missing",
          },
          wineryRating: 0,
          foodPairings: [""],
          style: "",
          varietal: "",
          style_stats: {
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
          recommended_vintages: {
            year: 1900,
            type: "",
          },
          image: "",
        };
      }
      //return object with data  ultimately this is a remap of the original JSON data to focus on needed properties
      return {
        wineFacts: (() => {
          let facts = {};
          Object.entries(factsKey).forEach(([key, value]) => {
            if (key === "wineName") {
              facts = { ...facts, ...{ "Wine Name": value } };
            } else facts = { ...facts, [key]: value };
          });
          return facts;
        })() as Record<string, any>,
        wineryRating:
          dataKey["winery"]?.["statistics"]?.["ratings_average"] ??
          (0 as number),
        foodPairings:
          dataKey["foods"]?.map((f: any) => f["name"]) ?? ([] as string[]),
        style: styleKey ? styleKey?.["name"] : ("N/A" as string),
        varietal: styleKey ? styleKey["varietal_name"] : ("N/A" as string),
        style_stats: styleKey
          ? {
              Description: styleKey?.["description"] ?? ("N/A" as string),
              "Interesting Facts":
                styleKey?.["interesting_facts"] ?? ("N/A" as string),
              "Body Rating": styleKey?.["body"] ?? (0 as number),
              "Body Description":
                styleKey?.["body_description"] ?? ("N/A" as string),
              "Acidity Rating": styleKey?.["acidity"] ?? (0 as number),
              "Acidity Description":
                styleKey?.["acidity_description"] ?? ("N/A" as string),
              BaseStats: styleKey?.["baseline_structure"] ?? {
                Error: "No baseline structure found",
              },
            }
          : ("N/A" as any),
        recommended_vintages: recommendedVintages
          ? recommendedVintages?.length > 0
            ? recommendedVintages.map((v: any) => ({
                year: v?.["vintage"]?.["year"] ?? 1900,
                type: v?.["type"] ?? "N/A",
              }))
            : "N/A"
          : ("N/A" as any),
        image: baseProtocol + (imageLoc ?? ""),
      };
    });
  }
  return Response.json(summaryData);
};

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
