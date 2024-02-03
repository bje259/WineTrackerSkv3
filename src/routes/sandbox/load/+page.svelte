<script lang="ts">
  import type { PageData } from "./$types.d.ts";
  import { OpenAIEmbeddings } from "@langchain/openai";
  import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Document } from "@langchain/core/documents";
  import type { EmbeddingsInterface } from "@langchain/core/embeddings";

  import type {
    WineData,
    WineFacts,
    BaseStats,
    Stylestats,
    Recommendedvintage,
    WineInfo,
  } from "$lib/index.js";
  import { onMount } from "svelte";
  export let data: PageData;
  import { browser } from "$app/environment";
  import { lazyLoad, p, pt } from "$lib/utils.js";
  // const { documents, config, OAIString } = data;
  const { documents } = data;
  let output: WineData[] = [];
  import fs from "fs";
  import { flatten } from "flat";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  let bodyValue = "";
  let methodValue = "";
  let pathValue = "";
  let qOutput = "";

  function capitalizeWords(input: string) {
    return input
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function downloadJSON(jsonData: any, filename: string) {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function fetchData() {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=20"
    );
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  async function runQuery(path: string, method: string, body: string) {
    p("params: ", path, method, body);
    qOutput = "";
    try {
      if (method === "GET") {
        const response = await fetch(path + body, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        qOutput = data;
      } else {
        const response = await fetch(path, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });
        const data = await response.json();
        qOutput = data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function runCode(path: string, method: string, body: string) {
    p("params: ", path, method, body);
    qOutput = "";
    try {
      const response = await fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      const data = await response.json();
      qOutput = data || "No data returned";
    } catch (error) {
      console.log(error);
    }
  }

  // async function main() {
  //   let OpenAIEmbed: EmbeddingsInterface | null = null;
  //   try {
  //     OpenAIEmbed = JSON.parse(OAIString);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   if (OpenAIEmbed === null || OpenAIEmbed == undefined) {
  //     console.log("OpenAIEmbed is undefined");
  //     return;
  //   }
  // const neo4jVectorIndex = await Neo4jVectorStore.fromDocuments(
  // 	documents,
  // 	new OpenAIEmbeddings({
  // 		openAIApiKey: PUBLIC_OPENAI_API_KEY,
  // 		modelName: 'text-embedding-3-small'
  // 	}),
  // 	config
  // );

  // const results = await neo4jVectorIndex.similaritySearch('water', 1);

  // console.log(results);
  // output = results;

  // const strResponse = await fetch('/API/test1', {
  // 	method: 'GET',
  // 	headers: {
  // 		'Content-Type': 'application/json'
  // 	}
  // });
  // try {
  // 	output = await strResponse.json();
  // 	console.log(output);
  // } catch (error) {
  // 	console.log(error);
  // }

  /*
  [ Document { pageContent: 'Cat drinks milk', metadata: { a: 1 } } ]
  
*/

  // await neo4jVectorIndex.close();

  async function validateResponse(response: Response): Promise<boolean> {
    try {
      const resp = response;
      console.log(resp);
      if (resp === undefined || resp === null) {
        return false;
      }
      if (!Array.isArray(resp)) {
        return false;
      }
      const data: WineData[] = resp as WineData[];
      console.log(data);
      if (data.length === 0) {
        return false;
      }
      let valid = true;
      data.forEach((wineData) => {
        if (wineData?.wineFacts === undefined || wineData?.wineFacts === null) {
          valid = false;
          return false;
        }
        if (
          wineData?.["foodPairings"] === undefined ||
          wineData?.["foodPairings"] === null
        ) {
          valid = false;
          return false;
        }
        if (
          wineData?.recommended_vintages === undefined ||
          wineData?.recommended_vintages === null
        ) {
          valid = false;
          return false;
        }
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
</script>

<!-- Currently this is just a sandbox style page ristricted to Admins, I'm using the buttons for testing different functions -->
<div class="flex flex-col w-full">
  <h1>Wine Data Manipulaation Test Page</h1>
  <!-- Button to test APIs with apify or pocketbase -->
  <Button on:click={() => runQuery(pathValue, methodValue, bodyValue)}
    >RunQuery</Button
  >

  <Button on:click={() => runCode(pathValue, methodValue, bodyValue)}
    >RunCode</Button
  >
  <!-- Test button currently set to test creating a new record -->
  <div class="grid grid-cols-1">
    <Button
      on:click={async () => {
        const data = output;
        // await pb.collection('example').create(data);
        p(data);
        await fetch("/api/WineInfo", {
          method: "POST",
          body: JSON.stringify(data),
        }).then(async (response) => {
          console.log(response);
          let tempOutput;
          try {
            tempOutput = await response.json();
          } catch (error) {
            console.log(error);
          }
          p(tempOutput);
        });
      }}>Test</Button
    >

    <!-- Download JSON button for inspecting the full transformed dataset in flattened -->
    <Button
      on:click={(e) => {
        e.preventDefault();
        let flattenedData = output;
        let flatData = flattenedData.map((item) => flatten(item));
        p(flatData);
        if (flatData) downloadJSON(flatData, "flattenedData.json");
      }}>Download Json</Button
    >
    <!-- This button pulls the dataset from apify and generates JSOn output for the Svelte non-script code -->
    <Button
      on:click={async () => {
        await fetch("/api/loadApify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          console.log(response);
          let tempOutput = [];
          try {
            tempOutput = await response.json();
          } catch (error) {
            console.log(error);
          }
          if (await validateResponse(tempOutput)) {
            output = tempOutput;
            p(output[0]);
          } else {
            console.log("Invalid response");
          }
        });
        // fs.writeFile("./output.json", JSON.stringify(output, null, 2), (err) => {
        //   if (err) {
        //     console.log(err);
        //   }
        //   console.log("Successfully written to file");
        // });
      }}>New Apify Dload</Button
    >
  </div>

  <!-- Inputs for testing API interfaces -->
  <div class="grid grid-flow-row grid-rows-3 mt-8 items-center">
    <div>
      <Label for="path" class="w-44">Path</Label>
      <Input class="w-full" id="path" bind:value={pathValue} />
    </div>
    <div>
      <Label for="method" class="w-44">Method</Label>
      <Input class="w-full" id="method" bind:value={methodValue} />
    </div>
    <div>
      <Label for="body" class="w-44">Body</Label>
      <Textarea id="body" bind:value={bodyValue} />
    </div>
  </div>
  <!-- API test output  -->
  {#if qOutput}
    <div class="grid grid-cols-1">
      <pre>{JSON.stringify(qOutput, null, 2)}</pre>
    </div>
  {/if}
  <!-- Beggining of Apify data info blocks with lazy loaded images -->
  {#each output as wineData}
    <div class="border-token mb-2">
      <div class="grid grid-cols-12 p-2">
        <h3 class="text-center col-span-12">
          {wineData.wineFacts?.["Wine Name"] ?? ""}
        </h3>
        <div class="col-start-1 col-span-2 align-top h-24">
          <!-- <img
					data-src={wineData.image ?? ''}
					alt={wineData.wineFacts?.['Wine Name'] ?? ''}
					class="w-full"
				/> -->
          {#await fetchData()}
            <p>loading</p>
            <img src="/giphy.gif" alt="loading" />
          {:then items}
            <figure>
              <img
                use:lazyLoad={wineData.image ?? ""}
                alt={wineData.wineFacts?.["Wine Name"] ?? ""}
              />
            </figure>
          {:catch error}
            <p style="color: red">{error.message}</p>
          {/await}
        </div>
        <div class="p-2 col-start-3 col-span-4 align-top">
          <h3 class="text-center">Wine Facts</h3>
          {#each Object.entries(wineData.wineFacts) as [key, value]}
            <div class="">
              <p>{key}: {value}</p>
            </div>
          {/each}
          <p>Winery Rating: {wineData.wineryRating}</p>
        </div>
        <div class="p-2 col-start-8 col-span-4 align-top">
          <h3>Food Pairing Recommendations</h3>
          {#each Object.values(wineData["foodPairings"]) as foodPairing, index}
            <p>{index + 1}. {foodPairing}</p>
          {/each}
          <div class="pt-3">
            <h3>Recommended Vintages:</h3>
            {#if typeof wineData?.recommended_vintages === "string"}
              <p>1. {wineData?.recommended_vintages}</p>
            {:else}
              {#each Object.entries(wineData?.recommended_vintages) as [key, recommendedVintage], index}
                <p>
                  {index + 1}. {recommendedVintage?.year} - {capitalizeWords(
                    recommendedVintage?.type ?? ""
                  )}
                </p>
              {/each}
            {/if}
          </div>
        </div>
        <h3 class=" col-start-2 col-span-10 text-center self-center">
          Wine Style
        </h3>
        <div class="p-2 col-start-3 col-span-9 align-top text-start">
          {#if wineData?.styleStats?.["Description"] !== "N/A"}
            <p class="text-start mb-3">
              Description: {wineData?.styleStats?.["Description"]}
            </p>
          {/if}
          {#if wineData?.styleStats?.["Interesting Facts"] !== "N/A"}
            <p class="text-start">
              Interesting Facts: {wineData?.styleStats?.["Interesting Facts"]}
            </p>
          {/if}
          <div class="grid grid-cols-3">
            <div class="p-2 grid col-start-1 col-span-1 align-top text-start">
              <p>Style: {wineData?.style}</p>
              <p>Varietal: {wineData?.varietal}</p>
            </div>
            <div class="p-2 grid col-start-2 col-span-1 align-top">
              <div class=" p-1 text-start align-top">
                <p>Body Rating: {wineData?.styleStats?.["Body Rating"]}</p>
                <p>
                  Body Description: {wineData?.styleStats?.["Body Description"]}
                </p>
                <p>
                  Acidity Rating: {wineData?.styleStats?.["Acidity Rating"]}
                </p>
                <p>
                  Acidity Description: {wineData?.styleStats?.[
                    "Acidity Description"
                  ]}
                </p>
              </div>
            </div>
            <div class="p-2 grid col-start-3 col-span-1 align-top">
              <div class=" p-1 text-start align-top">
                <p>
                  Acidity: {wineData?.styleStats?.["BaseStats"]?.["acidity"]}
                </p>
                <p>
                  Fizziness: {wineData?.styleStats?.["BaseStats"]?.[
                    "fizziness"
                  ]}
                </p>
                <p>
                  Intensity: {wineData?.styleStats?.["BaseStats"]?.[
                    "intensity"
                  ]}
                </p>
                <p>
                  Sweetness: {wineData?.styleStats?.["BaseStats"]?.[
                    "sweetness"
                  ]}
                </p>
                <p>
                  Tannin: {wineData?.styleStats?.["BaseStats"]?.["tannin"]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<!-- <p>Apify response:<br /></p>
<pre>{JSON.stringify(output, null, 2)}</pre> -->

<style>
  figure {
    margin-bottom: 100vh;
  }
  img {
    opacity: 0;
    transition: all 2s ease;
  }
</style>
