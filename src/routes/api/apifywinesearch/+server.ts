import type { RequestHandler } from "./$types";
import { p, pt, PO } from "$lib/utils.js";
import { error, json } from "@sveltejs/kit";
import { APIFY_TOKEN } from "$env/static/private";
import {
  ApifyClient,
  type DatasetCollectionClientGetOrCreateOptions,
  type DatasetClient,
  type Dataset,
} from "apify-client";
let log = new PO();
export const DELETE: RequestHandler = async ({ locals, fetch }) => {
  log = locals.log || log;
  const client = new ApifyClient({
    token: APIFY_TOKEN,
  });
  // try {
  //   // await client.dataset("bje259~remoteWineResults3").delete();
  //   await client.dataset("bje259~remoteWineInputData").delete();
  // } catch (e) {
  //   log.p("error: ", e);
  //   // return error(500, "Internal Server Error");
  // }

  try {
    await client.dataset("bje259/remoteWineResults3").delete();
    await sleep(5000);
    const createDataset = await client
      .datasets()
      .getOrCreate("remoteWineResults3");
    return json(createDataset);
  } catch (e) {
    log.p("createDataset error: ", e);
    return error(500, "Internal Server Error");
  }

  return json({ message: "DELETE request received" });
};

export const GET: RequestHandler = async ({ locals, url, fetch }) => {
  log = locals.log || log;
  const params = url.searchParams.get("searchTerms") || "Malbec";
  log.p("params: ", params);
  const client = new ApifyClient({
    token: APIFY_TOKEN,
  });
  // try {
  //   const run = await fetch(
  //     `https://api.apify.com/v2/datasets/bje259-remoteWineResults3?token=${APIFY_TOKEN}`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify(inputFormatted),
  //     }
  //   );
  //   const runResp = await run.json();
  //   log.p("runResp: ", runResp);
  //   return json(runResp);
  // } catch (e) {
  //   return error(500, "Internal Server Error");
  // }
  try {
    // await client.dataset("bje259~remoteWineResults3").delete();
    await client.dataset("bje259/remoteWineInputData").delete();
    // log.p("skip delete");
  } catch (e) {
    log.p("error: ", e);
    // return error(500, "Internal Server Error");
  }
  await sleep(5000);
  try {
    const createDataset = await client
      .datasets()
      .getOrCreate("remoteWineInputData");
    // return json(createDataset);
  } catch (e) {
    log.p("createDataset error: ", e);
    return error(500, "Internal Server Error");
  }
  const testInput = [
    {
      Search_Term: "Becker Vineyards Primavera",
    },
    {
      Search_Term: "Irwin Family Tempranillo Piedra Rojo Block 22",
    },
  ];
  await waitForNewDataset(client, "remoteWineInputData");
  await client.dataset("bje259/remoteWineInputData").pushItems(testInput);
  await sleep(5000);
  try {
    // const run = await fetch(
    //   `https://api.apify.com/v2/datasets/bje259~remoteWineResults3/items?token=${APIFY_TOKEN}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     // body: JSON.stringify(inputFormatted),
    //   }
    // );
    // const runResp = await run.json();
    // log.p("runResp: ", runResp);
    // return json({ runRes: runResp, items: items });
    const { items } = await client
      .dataset("bje259/remoteWineInputData")
      .listItems();
    return json({ items: items });
    // return json(runResp);
  } catch (e) {
    return error(500, "Internal Server Error");
  }
  // const response = await fetch(
  //   "https://api.apify.com/v2/datasets/aoW9MflHbcOqnsYKv/items"
  // );
  // const data = await response.json();
  // log.p("data: ", data);

  // return json(data);
};
/**
 *
 * @param {RequestHandler} { locals, request, fetch }
 * @returns {Response}
 */
export const POST: RequestHandler = async ({ locals, request, fetch, url }) => {
  log = locals.log || log;
  const client = new ApifyClient({
    token: APIFY_TOKEN,
  });
  const params = url.searchParams.get("searchTerms") || "Malbec";
  log.p("params: ", params);
  const currentDatasets = await client.datasets().list();
  if (
    currentDatasets.items.find((item) => item.name === "remoteWineInputData")
  ) {
    try {
      // await client.dataset("bje259~remoteWineResults3").delete();
      await client.dataset("bje259/remoteWineInputData").delete();
    } catch (e) {
      log.p("error: ", e);
      // return error(500, "Internal Server Error");
    }
  }
  //first request to get the current dataset id
  // const body = await request.json();
  //////testing
  // const body = [
  //   {
  //     Search_Term: "Becker Vineyards Reserve Merlot",
  //   },
  // ];
  const searchTerms = params.split(",");
  const body = searchTerms.map((term) => {
    return {
      Search_Term: term,
    };
  });
  log.p("body: ", body);
  if (Array.isArray(body)) {
    log.p("body is array");
  } else {
    return error(400, "Bad Request, not an array");
  }
  log.p("jsonStringified: ", JSON.stringify(body));

  // let currentID = "0";
  // try {
  //   const currData = await fetch(
  //     `https://api.apify.com/v2/datasets?token=${APIFY_TOKEN}&desc=true&unnamed=false`,
  //     {
  //       method: "GET",
  //     }
  //   );
  //   // get current data for input
  //   const currDataJson = await currData.json();
  //   log.p("currDataJson: ", currDataJson);
  //   if (Array.isArray(currDataJson.data.items)) {
  //     currentID = currDataJson.data.items.find(
  //       (item: any) => item.name === "remoteWineInputData"
  //     ).id;
  //   } else {
  //     return error(500, "Internal Server Error");
  //   }
  // } catch (e) {
  //   log.p("currData error: ", e);
  //   return error(500, "Internal Server Error");
  // }

  // log.p("currentID: ", currentID);
  //delete current input data
  // try {
  //   // const deleteResp = await fetch(
  //   //   `https://api.apify.com/v2/datasets/${currentID}?token=${APIFY_TOKEN}`,
  //   //   {
  //   //     method: "DELETE",
  //   //   }
  //   // );
  //   await client.dataset("bje259/remoteWineInputData").delete();
  // } catch (e) {
  //   log.p("deleteResp error: ", e);
  //   return error(500, "Internal Server Error");
  // }
  //create new input data dataset
  // const createDataset = await fetch(
  //   `https://api.apify.com/v2/datasets?token=${APIFY_TOKEN}&name=remoteWineInputData`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   }
  // );
  // if (!createDataset.ok) {
  //   return error(500, "Internal Server Error");
  // }
  // let createDataset: Dataset;
  // try {
  //   createDataset = await client.datasets().getOrCreate("remoteWineInputData", {
  //     schema: {
  //       name: "remoteWineInputData",
  //       version: 1,
  //       fields: {
  //         searchTerms: { type: "array" },
  //         maxCrawlPages: { type: "number" },
  //       },
  //     },
  //   });
  // } catch (e) {
  //   log.p("createDataset error: ", e);
  //   return error(500, "Internal Server Error");
  // }

  // const createDatasetResp = await createDataset.json();
  // log.p("createDatasetResp: ", createDatasetResp);
  // const newInputId = createDataset.id;
  // //update new input data
  // const updateDataset = await fetch(
  //   `https://api.apify.com/v2/datasets/${newInputId}/items?token=${APIFY_TOKEN}`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   }
  // );
  // try {
  //   const updateInputData = await updateDataset.json();
  //   log.p("updateInputData: ", updateInputData);
  //   // return json(updateInputData);
  // } catch (e) {
  //   return error(500, "Internal Server Error");
  // }

  await sleep(5000);
  let createDataset: Dataset;
  try {
    createDataset = await client.datasets().getOrCreate("remoteWineInputData");
    log.p("createDataset: ", createDataset);
    // return json(createDataset);
  } catch (e) {
    log.p("createDataset error: ", e);
    return error(500, "Internal Server Error");
  }

  try {
    await waitForNewDataset(client, "remoteWineInputData");
    log.p(
      "Trying: ",
      `/v2/datasets/bje259/remoteWineInputData.pushItems(${JSON.stringify(body)})`
    );
    // const listDS = await client.datasets().list();
    // log.p("listDS: ", listDS);

    // createDataset = await client.datasets().getOrCreate("remoteWineInputData");
    // log.p("createDataset: ", createDataset);
    // return json(createDataset);
    await client.dataset("bje259/remoteWineInputData").pushItems(body);
  } catch (e) {
    log.p("pushItems error: ", e);
    return error(500, "Internal Server Error");
  }

  await sleep(5000);
  const check = await client.dataset("bje259/remoteWineInputData").listItems();
  log.p("check: ", check);
  //format input for run
  const inputFormatted = {
    searchTermsUrl: `https://api.apify.com/v2/datasets/bje259~remoteWineInputData/items?token=${APIFY_TOKEN}&clean=true&format=json`,
    maxCrawlPages: 50,
    noDetail: false,
  };
  //run the actor
  const myActor = client.actor("bje259/winesearch2");
  let runResp;
  try {
    const run = await myActor.call(inputFormatted);
    // const run = await fetch(
    //   `https://api.apify.com/v2/acts/bje259~winesearch2/run-sync?token=${APIFY_TOKEN}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(inputFormatted),
    //   }
    // );
    runResp = run;
    // const runResp = await run.json();
    log.p("runResp: ", runResp);
    // return json(runResp);
  } catch (e) {
    return error(500, "Internal Server Error");
    // await sleep(5000);
  }

  // try {
  //   const run = await fetch(
  //     `https://api.apify.com/v2/datasets/bje259~remoteWineResults3/items?token=${APIFY_TOKEN}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify(inputFormatted),
  //     }
  //   );
  //   const runResp = await run.json();
  //   log.p("runResp: ", runResp);
  //   return json(runResp);
  // } catch (e) {
  //   return error(500, "Internal Server Error");
  // }
  const results = await client.dataset("bje259/remoteWineResults3").listItems();
  log.p("results: ", results);

  client.dataset("bje259/remoteWineInputData").delete();
  return json(results);

  const data = { message: "POST request received" };
  return json(data);
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForNewDataset(
  client: ApifyClient,
  datasetName: string
): Promise<Dataset> {
  let dataset: Dataset | undefined;
  while (true) {
    try {
      dataset = await client.dataset(`bje259/${datasetName}`).get();
      if (dataset) {
        log.p("done waiting!");
        break;
      } else {
        log.p("waiting 5 seconds for dataset");
        await sleep(5000);
      }
      // return dataset;
    } catch (e) {
      log.p("waitForNewDataset error: ", e);
      await sleep(5000);
    }
  }
  return dataset;
}
