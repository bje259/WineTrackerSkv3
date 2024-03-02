<script lang="ts">
  import type { PageData } from "./$types.d.ts";
  import { OpenAIEmbeddings } from "@langchain/openai";
  import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
  import { preloadData, pushState, goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.ts";
  import { Document } from "@langchain/core/documents";
  import type { EmbeddingsInterface } from "@langchain/core/embeddings";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import CodePage from "../../wineinfo/[code]/+page.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { page } from "$app/stores";
  import { localStorageStore } from "@skeletonlabs/skeleton";
  import { type Writable, writable } from "svelte/store";
  import { trpc } from "$lib/trpc/client";
  // import { trpc } from '$lib/trpc/client';
  import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
  import { TRPCClientError } from "@trpc/client";
  import type {
    WineData,
    WineFacts,
    BaseStats,
    Stylestats,
    Recommendedvintage,
    WineInfo,
    WineInfoDataRecord,
  } from "$lib/WineTypes.js";
  import {
    WineInfoDataRecordSchema,
    getWineFacts,
    getFoodPairings,
    getRecommendedVintages,
    getInterestingFacts,
    validateWineType,
  } from "$lib/WineTypes.js";
  import { onMount } from "svelte";
  import * as Select from "$lib/components/ui/select";

  export let data: PageData;
  import { browser } from "$app/environment";
  import { lazyLoad, p, pt, PO } from "$lib/utils.js";
  // const { documents, config, OAIString } = data;
  const { documents, routes } = data;
  let output: WineData[] = [];
  import fs from "fs";
  import { flatten } from "flat";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import SummaryResults from "../../../SummaryResults.json";
  import WineInfoData1 from "../../../WineInfoData1.json";
  import { string } from "zod";
  import { FileSpreadsheet } from "lucide-svelte";
  // import type { RouterOutputs } from "$lib/trpc/router";
  const log = new PO();

  let bodyValue = "";
  let methodValue = "";
  let pathValue = "";
  let qOutput: any = "";
  let dOutput: unknown;
  let tableHeaders: string[] = [];
  let tableData: Record<string, string>[] = [];
  let dtableHeaders: string[] = [];
  let dtableData: Record<string, string>[] = [];
  let checked = false;
  // Initialize stores with empty strings as initial values
  // These will be overwritten with values from localStorage when on the client-side
  let bodyStore = writable("");
  let methodStore = writable("");
  let pathStore = writable("");
  let checkedStore = writable(false);
  let test = "test2";
  let selectedRouteStore = writable("");
  let value2Store = writable("");
  let fieldsStore = writable("");
  let filterStore = writable("");
  let expandStore = writable("");
  let collectionStore = writable("");
  let collection = "";
  let value2 = "";
  const queryParams = new Map<string, string>();
  let selectedRoute = "";
  let qIn: RouterInputs["pbCollection"]["getRecords"] = {
    collection: "",
    opts: {},
  };
  $: log.p("selectedRoute", selectedRoute);

  onMount(() => {
    // Replace the writable stores with localStorage-backed stores
    // This happens only on the client side, ensuring localStorage is available
    bodyStore = localStorageStore("bodyStore", "");
    methodStore = localStorageStore("methodStore", "");
    pathStore = localStorageStore("pathStore", "");
    checkedStore = localStorageStore("checkedStore", false);
    value2Store = localStorageStore("value2Store", "");
    fieldsStore = localStorageStore("fieldsStore", "");
    filterStore = localStorageStore("filterStore", "");
    expandStore = localStorageStore("expandStore", "");
    selectedRouteStore = localStorageStore("selectedRouteStore", "");
    collectionStore = localStorageStore("collectionStore", "");
    bodyValue = $bodyStore;
    methodValue = $methodStore;
    pathValue = $pathStore;
    checked = $checkedStore;
    value2 = $value2Store;
    selectedRoute = $selectedRouteStore;
    queryInput.collection = $collectionStore;
    queryInput.filter = $filterStore;
    queryInput.fields = $fieldsStore;
    queryInput.expand = $expandStore;
    log.p("onMount", {
      bodyValue,
      methodValue,
      pathValue,
      checked,
      value2,
      selectedRoute,
      queryInput,
    });
    // queryInput.selectedRoute = $selectedRouteStore;
    // queryParams.set("filter", $filterStore);
    // queryParams.set("fields", $fieldsStore);
    // queryParams.set("expand", $expandStore);
  });

  $: tableFlag = checked;
  $: log.p("tableFlag", tableFlag);
  $: log.p("page", $page);
  let codeDialogOpen = false;
  $: if ($page.state.wineInfoData) {
    codeDialogOpen = true;
  } else {
    codeDialogOpen = false;
  }

  function capitalizeWords(input: string) {
    return input
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async function formatSummary() {
    log.p("Summary Results: ", SummaryResults);
    const parsed = SummaryResults.map((item: string) => {
      log.p("item", item);
      const [codePart, summaryPart] = item.split("\n");
      const code = codePart?.replace("Code: ", "")?.trim();
      const summary = summaryPart?.replace("Summary: ", "")?.trim();
      return { Code: code ?? "N/A", Summary: summary ?? "N/A" };
    });
    log.p(parsed);
    const updatedWID = WineInfoData1.map((item: any) => {
      const summary = parsed.find((pitem: any) => item?.Code === pitem?.Code);
      return { ...item, Summary: summary?.Summary ?? "N/A" };
    });
    log.p(updatedWID);

    try {
      await fetch("/api/loadApify2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWID),
      }).then(async (response) => {
        log.p(response);
        let tempOutput = [];
        try {
          tempOutput = await response.json();
        } catch (error) {
          log.p(error);
        }
      });
    } catch (error) {
      log.p(error);
    }
    log.p("done updating WineInfoData1");

    // return parsed;
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

  async function onDialogLinkClick(e: MouseEvent) {
    // bail if opening a new tab
    if (e.metaKey || e.ctrlKey) return;
    // prevent full navigation
    e.preventDefault();

    const href = "/wineinfo/1234";
    log.p("🚀 ~ file: +layout.svelte:74 ~ href:", href);

    // run `load` functions (or rather, get the result of the `load` functions
    // that are already running because of `data-sveltekit-preload-data`)
    // await preloadData(href)
    //   .then((result) => {
    //     log.p("🚀 ~ file: +layout.svelte:79 ~ result:", result);

    //     if (result.type === "loaded" && result.status === 200) {
    //       pushState(href, { loginPageData: result.data });
    //       log.p(
    //         "🚀 ~ file: +layout.svelte:83 ~ href,result:",
    //         href,
    //         result
    //       );
    //     } else {
    //       // something bad happened! try navigating
    //       goto(href);
    //     }
    //   })
    //   .catch((err) => {
    //     // something bad happened! try navigating
    //     goto(href);
    //   });
    const WIData = validateWineType<WineInfoDataRecord>(
      "WineInfoData",
      qOutput as WineInfoDataRecord
    );
    pushState(href, {
      user: data.user,
      admin: data.admin,
      wineInfoData: WIData,
    });
    p("pagestate", $page.state);
  }

  async function runQuery(path: string, method: string, body: string) {
    // p("params: ", path, method, body);
    qOutput = "";
    tableHeaders = [];
    tableData = [{} as Record<string, string>];
    // tableFlag = tabFlag;

    bodyStore.set(body);
    methodStore.set(method);
    pathStore.set(path);
    checkedStore.set(checked);

    try {
      if (method === "GET") {
        const response = await fetch(path + body, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        });
        type t = Record<string, any>;
        type k = keyof t;
        type m = Iterable<readonly [string, any]>;
        let data: t = await response.json();
        if (Object.keys(data).includes("mapGrpRes")) {
          const mapkey: k = "mapGrpRes" as k;
          data[mapkey] = new Map<string, any>(
            Object.entries(data[mapkey]) as m
          );
        }

        if (tableFlag) {
          ({ tablejson: tableData, jsonHeaders: tableHeaders } =
            jsonToTable(data));
        } else {
          qOutput = data;
          log.p("data", data);
        }
        // qOutput = data;
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
      log.p(error);
    }
  }

  function jsonToTable(json: any) {
    let tablejson: Record<string, string>[] = [];
    let jsonData: Record<string, any>[] = [];
    let jsonHeaders: string[] = [];
    // p("json", json);
    if (!json) {
      return { tablejson, jsonHeaders };
    }
    if (!Array.isArray(json)) {
      jsonData = [json as Record<string, any>];
    } else {
      jsonData = json as Record<string, any>[];
    }
    for (const [key, value] of Object.entries(jsonData[0])) {
      jsonHeaders = [...jsonHeaders, key];
    }
    log.p("headers", jsonHeaders);

    for (const item of jsonData) {
      let row: Record<string, string> = {};
      let i = 0;
      // p("item", item);
      for (const [key, value] of Object.entries(item)) {
        if (value === null || value === undefined) {
          row[jsonHeaders[i]] = "N/A";
        } else if (typeof value === "object") {
          row[jsonHeaders[i]] = JSON.stringify(value);
        } else if (typeof value === "string") {
          row[jsonHeaders[i]] = value;
        } else {
          row[jsonHeaders[i]] = value.toString();
        }
        i++;
      }
      if (tablejson[0] && Object.entries(tablejson[0]).length === 0) {
        tablejson[0] = row;
      } else {
        tablejson = [...tablejson, row];
      }
      // tablejson.push(row);
    }
    log.p("tablejson", tablejson);
    return { tablejson, jsonHeaders };
  }

  async function summarizeJson(): Promise<void> {
    try {
      await runQuery("/api/WineInfoData", "GET", "");
      // p("check1", qOutput);
      const parsed = qOutput?.items ?? qOutput ?? [];
      // p("check2", parsed);
      const test = parsed.map((item: any) => flatten(item));
      log.p("check3", test[0]);
      // const testLoad = test.map((item: any) => {
      //   return {
      //     WineName: item?.["WineName"] ?? "N/A",
      //     WineInfo: item,
      //   };
      // });
      log.p("check4", test[0]);
      await runQuery("/api/summarize", "POST", JSON.stringify(test));
    } catch (error) {
      log.p(error);
    }
    log.p("Summarization done");
  }

  async function runCode(path: string, method: string, body: string) {
    log.p("params: ", path, method, body);
    qOutput = "";
    try {
      const response = await fetch(path, {
        method: method,
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: body,
      });
      const data = await response.json();
      qOutput = data || "No data returned";
    } catch (error) {
      log.p(error);
    }
  }

  async function validateResponse(response: Response): Promise<boolean> {
    try {
      const resp = response;
      log.p(resp);
      if (resp === undefined || resp === null) {
        return false;
      }
      if (!Array.isArray(resp)) {
        return false;
      }
      const data: WineData[] = resp as WineData[];
      log.p(data);
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
      log.p(error);
      return false;
    }
    return true;
  }

  let greeting = "press the button to load data";
  let loading = false;

  const loadData = async () => {
    loading = true;
    log.p("$page", $page);
    greeting = data.greeting;
    loading = false;
  };
  $: if (data?.testMatchRoute) {
    ({ tablejson: dtableData, jsonHeaders: dtableHeaders } = jsonToTable(
      data.testMatchRoute
    ));
    dOutput = data.testMatchRoute;
  }
  $: queryParams.set("filter", queryInput.filter);
  $: queryParams.set("fields", queryInput.fields);
  $: queryParams.set("expand", queryInput.expand);
  $: queryParams.set("input", queryInput.input);
  $: queryParams.set("collection", queryInput.collection);
  $: selectedRouteValues = {
    label: selectedRoute || "Procedure",
    value: selectedRoute,
  };
  $: value2Values = { label: value2 || "Sub select", value: value2 };
  // $: selectedRoute = $selectedRouteStore;
  // $: value2 = $value2Store;

  const testCall = async () => {
    log.p("testCall");
    return await trpc().pbCollection.getList.query();
  };
  // eval("testCall().then((res) => {log.p(res)})");
  let queryInput: Record<string, string> = {};
  // let value2 = "";
  const queryStrings = new Map<string, Function>();

  queryStrings.set("greeting", async () => {
    setStores();
    qOutput = await trpc().greeting.query();
  });
  queryStrings.set("testMatchRoute", async () => {
    setStores();
    qOutput = await trpc().testMatchRoute.query();
  });
  queryStrings.set("pbCollection.getList", async () => {
    setStores();
    qOutput = await trpc().pbCollection.getList.query();
  });
  queryStrings.set("pbCollection.getRecords", async () => {
    try {
      // let qIn: Partial<RouterInputs["pbCollection"]["getRecords"]> = {};
      // qIn = JSON.parse(queryInput)
      setStores();
      // if (
      //   queryParams.get("collection") === null ||
      //   queryParams.get("collection") === undefined
      // ) {
      //   throw new Error("Collection not specified");
      // }
      // let qIn: RouterInputs["pbCollection"]["getRecords"] = {
      //   collection: queryParams.get("collection")!,
      //   opts: {
      //     filter: queryParams.get("filter"),
      //     fields: queryParams.get("fields"),
      //     expand: queryParams.get("expand"),
      //     requestKey: queryParams.get("requestKey"),
      //     page: Number(queryParams.get("page")),
      //     perPage: Number(queryParams.get("perPage")),
      //     sort: queryParams.get("sort"),
      //   },
      // };
      // if (queryParams.get("input")) {
      //   const input = JSON.parse(queryParams.get("input")!);
      //   qIn = { ...qIn, ...input };
      //   // qIn = {JSON.parse(queryParams.get("input"), ...qIn)};
      // }
      // fieldsStore.set(qIn?.opts?.fields ?? "");
      // filterStore.set(qIn?.opts?.filter ?? "");
      // expandStore.set(qIn?.opts?.expand ?? "");
      // const splitColl = qIn.collection.split(".");
      // selectedRouteStore.set(splitColl[0]);
      // if (splitColl.length > 1) {
      //   value2Store.set(splitColl[1]);
      // }
      // selectedRouteStore.set(qIn?.collection);
      qOutput = await trpc().pbCollection.getRecords.query(qIn);
    } catch (error) {
      log.p(error);
    }
  });
  const setStores = () => {
    // if (
    //   queryParams.get("collection") === null ||
    //   queryParams.get("collection") === undefined
    // ) {
    //   throw new Error("Collection not specified");
    // }
    qIn = {
      collection: queryParams.get("collection") || "",
      opts: {
        filter: queryParams.get("filter"),
        fields: queryParams.get("fields"),
        expand: queryParams.get("expand"),
        requestKey: queryParams.get("requestKey") || undefined,
        page: Number(queryParams.get("page")) || undefined,
        perPage: Number(queryParams.get("perPage")) || undefined,
        sort: queryParams.get("sort") || undefined,
      },
    };
    if (queryParams.get("input")) {
      const input = JSON.parse(queryParams.get("input")!);
      qIn = { ...qIn, ...input };
      // qIn = {JSON.parse(queryParams.get("input"), ...qIn)};
    }
    log.p("qIn", qIn);
    log.p("path", selectedRoute, value2);
    selectedRouteStore.set(selectedRoute);

    value2Store.set(value2);
    collectionStore.set(qIn.collection);
    // value2Store.set(value2);
    fieldsStore.set(qIn?.opts?.fields ?? "");
    filterStore.set(qIn?.opts?.filter ?? "");
    expandStore.set(qIn?.opts?.expand ?? "");
    // selectedRouteStore.set(queryInput.collection);
  };
</script>

<!-- Currently this is just a sandbox style page ristricted to Admins, I'm using the buttons for testing different functions -->
<div class="flex flex-col w-full">
  <h1>Wine Data Manipulation Test Page</h1>
  <h6>Loading data in<br /><code>+page.svelte</code></h6>
  <a
    href="#load"
    role="button"
    class="secondary"
    aria-busy={loading}
    on:click|preventDefault={loadData}>Load</a
  >
  <p>{greeting}</p>
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
        qOutput = await testCall();

        // await formatSummary();
        // const data = output;
        // // await pb.collection('example').create(data);
        // p(data);
        // await fetch("/api/WineInfo", {
        //   method: "POST",
        //   body: JSON.stringify(data),
        // }).then(async (response) => {
        //   log.p(response);
        //   let tempOutput;
        //   try {
        //     tempOutput = await response.json();
        //   } catch (error) {
        //     log.p(error);
        //   }
        //   p(tempOutput);
        // });
      }}>Test</Button
    >

    <!-- Download JSON button for inspecting the full transformed dataset in flattened -->
    <Button
      on:click={(e) => {
        e.preventDefault();
        let flattenedData = qOutput;
        // let flatData = flattenedData.map((item) => flatten(item));
        let flatData = flattenedData;
        log.p(flatData);
        if (flatData) downloadJSON(flatData, "download.json");
      }}>Download Json</Button
    >

    <Button
      on:click={async (e) => {
        e.preventDefault();
        // let flattenedData = JSON.parse(qOutput);
        // let flatData = flattenedData.map((item) => flatten(item));
        // let flatData = flattenedData.slice(0, 1);
        // p(flatData);
        await summarizeJson();
      }}>Summarize Json</Button
    >
    <!-- This button pulls the dataset from apify and generates JSOn output for the Svelte non-script code -->
    <Button
      on:click={async () => {
        await fetch("/api/loadApify2", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          log.p(response);
          let tempOutput = [];
          try {
            tempOutput = await response.json();
          } catch (error) {
            log.p(error);
          }
          if (await validateResponse(tempOutput)) {
            output = tempOutput;
            log.p(output[0]);
          } else {
            log.p("Invalid response");
          }
        });
        // fs.writeFile("./output.json", JSON.stringify(output, null, 2), (err) => {
        //   if (err) {
        //     log.p(err);
        //   }
        //   log.p("Successfully written to file");
        // });
      }}>New Apify Dload</Button
    >
    <Button
      on:click={async (e) => {
        e.preventDefault();
        await onDialogLinkClick(e);
      }}>Open Dialog</Button
    >
    <Checkbox id="tabFlag" bind:checked />
    <Label
      for="tabFlag"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Table Query output
    </Label>
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
    <div>
      <Select.Root
        bind:selected={selectedRouteValues}
        onSelectedChange={(e) => {
          log.p("checkinge.value", e?.value);
          if (e?.value) {
            log.p("selectedRoute", e.value);
            selectedRoute = e.value;
            selectedRouteStore.set(selectedRoute);
            value2 = "";
            value2Store.set(value2);
          } else {
            log.p("selectedRoute missing");
            selectedRoute = "";
          }
        }}
      >
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder="Procedure" />
        </Select.Trigger>
        <Select.Content>
          {#each routes as route}
            <Select.Item value={route}>{route}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    {#if selectedRoute === "pbCollection"}
      <div>
        <Select.Root
          bind:selected={value2Values}
          onSelectedChange={(e) => {
            if (e?.value) {
              log.p("sub selection", e.value);
              value2 = e.value;
            } else {
              log.p("sub selection missing");
              value2 = "";
            }
          }}
        >
          <Select.Trigger class="w-[180px]">
            <Select.Value placeholder="Sub select" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value=".getList">getList</Select.Item>
            <Select.Item value=".getRecords">getRecords</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    {/if}
    <div>
      <Input
        type="text"
        bind:value={queryInput.collection}
        placeholder="collection"
        class="w-full"
      />
    </div>
    <div>
      <Input
        type="text"
        bind:value={queryInput.filter}
        placeholder="filter"
        class="w-full"
      />
    </div>
    <div>
      <Input
        type="text"
        bind:value={queryInput.fields}
        placeholder="fields"
        class="w-full"
      />
    </div>
    <div>
      <Input
        type="text"
        bind:value={queryInput.expand}
        placeholder="expand"
        class="w-full"
      />
    </div>
    <div>
      <Input
        type="text"
        bind:value={queryInput.input}
        placeholder="input"
        class="w-full"
      />
    </div>
    <div>
      <Button
        on:click={() => {
          if (selectedRoute) {
            log.p("selectedRoute", selectedRoute);
            const query = queryStrings.get(selectedRoute + value2);
            if (query) {
              query();
            } else {
              log.p("query not found");
            }
          }
        }}>RunCode</Button
      >
    </div>
  </div>
  <!-- API test output  -->
  {#if tableFlag}
    <table>
      <thead>
        <tr>
          {#each tableHeaders as header}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each tableData as row}
          <tr>
            {#each tableHeaders as header}
              <td class="text-center">{row[header]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:else if qOutput}
    <div class="grid grid-cols-1">
      <!-- {@html qOutput.toString().replace(/\n/g, "<br/>")} -->
      <pre>{JSON.stringify(qOutput, null, 2)}</pre>
    </div>
  {/if}
  {#if checked}
    <table>
      <thead>
        <tr>
          {#each dtableHeaders as header}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each dtableData as row}
          <tr>
            {#each dtableHeaders as header}
              <td class="text-center">{row[header]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:else if dOutput}
    <div class="grid grid-cols-1">
      <!-- {@html qOutput.toString().replace(/\n/g, "<br/>")} -->
      <pre>{JSON.stringify(dOutput, null, 2)}</pre>
    </div>
  {/if}
  <!-- {#if dOutput}
    <div class="grid grid-cols-1">
      <pre>{JSON.stringify(dOutput, null, 2)}</pre>
    </div>
  {/if} -->
  <!-- <div class="grid grid-cols-1"> -->
  <!-- {@html qOutput.toString().replace(/\n/g, "<br/>")} -->
  <!-- <p>Table: {tableFlag}</p>
    <pre>{JSON.stringify(tableHeaders, null, 2)}</pre>
    <pre>{JSON.stringify(tableData, null, 2)}</pre>
  </div> -->
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
<Dialog.Root
  open={codeDialogOpen}
  on:OpenChange={() => {
    if (!open) {
      history.back();
    }
  }}
>
  <Dialog.Content>
    {#if $page.state.wineInfoData && $page.state.user && $page.state?.admin}
      <CodePage
        data={{
          user: data.user,
          admin: data.admin,
          wineInfoData: $page.state.wineInfoData,
        }}
      />
    {:else}
      <p>Loading...</p>
    {/if}
  </Dialog.Content>
</Dialog.Root>

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
