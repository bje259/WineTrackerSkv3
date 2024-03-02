// import dotenv from "dotenv";
// dotenv.config();
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import type { WineInfoDataRecord } from "$lib/WineTypes";
import {
  WineInfoDataRecordSchema,
  validateZodSchema,
  Collections,
} from "$lib/WineTypes";
import { Document } from "langchain/document";
import SummaryResults from "../../SummaryWineInfoData.json";
import { p, pt } from "$lib/utils";
// console.log(process.env.NEO4J_PASSWORD);
// Configuration object for Neo4j connection and other related settings
const config = {
  // url: "neo4j+s://347fd78c.databases.neo4j.io", // URL for the Neo4j instance
  url: "neo4j://localhost:7687",
  username: "neo4j", // Username for Neo4j authentication
  password: process.env.NEO4J_PASSWORD ?? "",
  database: "winedb", // Password for Neo4j authentication
  indexName: "wine_embed", //"vector", // Name of the vector index
  keywordIndexName: "keyword", // Name of the keyword index if using hybrid search
  searchType: "vector" as const, // Type of search (e.g., vector, hybrid)
  nodeLabel: "ChunkTest", // Label for the nodes in the graph
  textNodeProperty: "text", // Property of the node containing text
  embeddingNodeProperty: "embedding", // Property of the node containing embedding
};

// const documents = [
//   { pageContent: "what's this", metadata: { a: 2 } },
//   { pageContent: "Cat drinks milk", metadata: { a: 1 } },
// ];

// const checkSchema = await validateZodSchema(
//   Collections.WineInfoDataArray,
//   SummaryResults
// );
// p(checkSchema);
// const inputData: WineInfoDataRecord[] = SummaryResults as WineInfoDataRecord[];
// // p(inputData);
// const documents = await formatWineInfo(inputData);
// p(documents[0]);
// const neo4jVectorIndex = await Neo4jVectorStore.fromDocuments(
//   documents,
//   new OpenAIEmbeddings(),
//   config
// );

const neo4jVectorIndex = await Neo4jVectorStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  config
);

const results = await neo4jVectorIndex.similaritySearch("Barbera", 3);
try {
  const jsonresults = await Promise.all(
    results.map(async (result) => {
      return {
        pageContent: JSON.parse(result.pageContent),
        metadata: result.metadata,
      };
    })
  );

  p(jsonresults);
} catch (e) {
  console.log(e);
}

// /*
//   [ Document { pageContent: 'Cat drinks milk', metadata: { a: 1 } } ]
// */

await neo4jVectorIndex.close();
// const llm = new ChatOpenAI();
// await llm.invoke("Hello, world!");

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
