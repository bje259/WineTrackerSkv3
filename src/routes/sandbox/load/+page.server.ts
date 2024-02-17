import type { PageServerLoad } from "./$types.d.ts";
import { OPENAI_API_KEY, NEO4J_PASSWORD } from "$env/static/private";
import { OpenAIEmbeddings } from "@langchain/openai";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
export const load = (async ({ locals, cookies }) => {
  // Configuration object for Neo4j connection and other related settings
  if (!locals.pb.authStore.isValid) {
    console.log("Not logged in");
    const message = {
      type: "error",
      message: "You must be logged in to access this page",
    } as const;
    throw redirect(303, "/login", message, cookies);
  }
  // if (!locals.pb.authStore.isAdmin && !locals.admin?.id) {
  //   console.log("Not admin");
  //   const message = {
  //     type: "error",
  //     message: "You must be an admin to access this page",
  //   } as const;
  //   throw redirect(303, "/", message, cookies);
  // }

  // try {
  //   if (!locals.pb.authStore.isValid) {
  //     throw error(401, "Unauthorized");
  //   }
  // } catch (e: any) {
  //   if (e.status === 401) throw redirect(303, "/login");
  //   else throw error(500, e);
  // }

  const config = {
    url: "neo4j+s://347fd78c.databases.neo4j.io:7687", // URL for the Neo4j instance
    username: "neo4j", // Username for Neo4j authentication
    password: NEO4J_PASSWORD, // Password for Neo4j authentication
    indexName: "demo1", // Name of the vector index
    keywordIndexName: "demo1kw", // Name of the keyword index if using hybrid search
    searchType: "vector" as const, // Type of search (e.g., vector, hybrid)
    nodeLabel: "demoChunk", // Label for the nodes in the graph
    textNodeProperty: "text", // Property of the node containing text
    embeddingNodeProperty: "embedding", // Property of the node containing embedding
  };

  const openAIEmbed = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });
  const OAIString = JSON.stringify(openAIEmbed);

  const documents = [
    { pageContent: "what's this", metadata: { a: 2 } },
    { pageContent: "Cat drinks milk", metadata: { a: 1 } },
  ];

  // const neo4jVectorIndex = await Neo4jVectorStore.fromDocuments(
  // 	documents,
  // 	new OpenAIEmbeddings(),
  // 	config
  // );

  // const results = await neo4jVectorIndex.similaritySearch('water', 1);

  // console.log(results);

  /*
  [ Document { pageContent: 'Cat drinks milk', metadata: { a: 1 } } ]
*/

  // await neo4jVectorIndex.close();

  return { documents };
}) satisfies PageServerLoad;
