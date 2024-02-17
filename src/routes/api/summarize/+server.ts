import type { RequestHandler } from "./$types";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Document } from "langchain/document";
import { error, json } from "@sveltejs/kit";
import { ClientResponseError, type RecordOptions } from "pocketbase";
import { p, pt } from "$lib/utils.js";
import type { WineInfoDataRecord } from "$lib/WineTypes";
import { WineInfoDataRecordSchema } from "$lib/WineTypes";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { OPENAI_API_KEY } from "$env/static/private";
process.env.OPENAI_API_KEY = OPENAI_API_KEY;
export const GET: RequestHandler = async (request) => {
  return new Response();
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const body = await request.json();
  const bodyTest = Array.from(body);
  // const blob = new Blob([JSON.stringify(body, null, 2)], {
  // type: "application/json",
  // });
  // const jsonString = JSON.stringify(body);
  // const loader = new JSONLoader("./WineInfoData1.json");
  // p(loader);
  // const docs = await loader.load();
  // p(docs);
  const docs = await formatWineInfo(body);
  const docsForPrompt = docs.map((doc) => {
    return {
      wineName: doc.metadata.wineName,
      winery: doc.metadata.winery,
      code: doc.metadata.code,
      doc: doc.pageContent,
    };
  });
  const model = new ChatOpenAI({});
  const promptTemplate = PromptTemplate.fromTemplate(
    "Given the following wine information, please provide a summary of the wine. \n\n{wineName} is a wine from {winery} and has the code: {code} \n\n WineData: {doc} \n\n Provide your response in the form of: \n\nCode: (insert wine code) Summary: (insert summary) \n\n"
  );
  const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
  // const results = await chain.invoke(docsForPrompt[0]);
  const results = await chain.batch(docsForPrompt);

  p(results);

  return json(results);
};

async function formatWineInfo(
  WineInfoData: WineInfoDataRecord[]
): Promise<Document[]> {
  return WineInfoData.map((item) => {
    return {
      pageContent: JSON.stringify(item) ?? "N/A",
      metadata: {
        code: item?.Code ?? "N/A",
        wineName: item?.WineName ?? "N/A",
        winery: item?.Facts_winery ?? "N/A",
      },
    };
  });
}
