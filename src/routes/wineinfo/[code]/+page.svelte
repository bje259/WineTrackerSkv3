<script lang="ts">
  import type { PageData } from "./$types.d.ts";
  import { Button } from "$lib/components/ui/button/index.ts";
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
  export let data: PageData;
  import { browser } from "$app/environment";
  import { lazyLoad, p, pt } from "$lib/utils.js";
  // const { documents, config, OAIString } = data;

  let output: WineData[] = [];
  import fs from "fs";
  import { flatten } from "flat";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  let dataLoaded = false;
  async function fetchData() {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=20"
    );
    const picdata = await res.json();

    if (res.ok) {
      return picdata;
    } else {
      throw new Error(picdata);
    }
  }
  function capitalizeWords(input: string) {
    return input
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  //   p("WineInfoData before validation: ", data.wineInfoData);
  let wineInfoData: WineInfoDataRecord;
  let wineFacts: WineFacts;
  let foodPairings: string[];
  let recommendedVintages: string[];
  let interestingFacts: string[];
  $: if (data.wineInfoData) {
    p("WineInfoData after validation: ", data.wineInfoData);
    wineInfoData = validateWineType<WineInfoDataRecord>(
      "WineInfoData",
      data.wineInfoData as WineInfoDataRecord
    );
    wineFacts = getWineFacts(wineInfoData);
    foodPairings = getFoodPairings(wineInfoData);
    recommendedVintages = getRecommendedVintages(wineInfoData);
    interestingFacts = getInterestingFacts(wineInfoData);
    dataLoaded = true;
  }
  //   let wineInfoData: WineInfoDataRecord =

  //   const parseAndUseWineInfoData = () => {
  //     const parse = WineInfoDataRecordSchema.safeParse(data.wineInfoData);
  //     if (parse.success) {
  //       wineInfoData = parse.data;
  //       // Now wineInfoData is guaranteed to be defined.
  //       // You can safely use wineInfoData here for further operations.
  //       console.log(wineInfoData);
  //       // Any other operations that depend on wineInfoData being defined.
  //     } else {
  //       console.error(parse.error);
  //       // Handle the error case, possibly setting wineInfoData to a default value or notifying the user.
  //     }
  //   };
</script>

<!-- Beggining of Apify data info blocks with lazy loaded images -->
<!-- {#each output as wineData} -->
<div class="border-token mb-2">
  <div class="grid grid-cols-12 p-2">
    {#if !dataLoaded}
      <p>Loading...</p>
    {/if}
    {#if dataLoaded}
      <h1 class="text-center col-span-12 text-3xl">
        {wineInfoData.WineName ?? ""}
      </h1>

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
          <br />
          <figure>
            <img
              use:lazyLoad={wineInfoData.Image ?? ""}
              alt={wineInfoData.WineName ?? ""}
            />
          </figure>
        {:catch error}
          <p style="color: red">{error.message}</p>
        {/await}
      </div>
      <div class="col-start-3 col-span-6 align-top">
        <h3 class="text-center">Summary</h3>
        <p class="text-start">
          {wineInfoData.Summary ?? ""}
        </p>
      </div>
      <!-- <div class="p-2 col-start-3 col-span-4 align-top"> -->
      <div class="p-2 col-start-9 col-span-4 align-top">
        <h3 class="text-center">Wine Facts</h3>
        {#each Object.entries(wineFacts) as [key, value]}
          <div class="">
            <p>{key}: {value}</p>
          </div>
        {/each}
        <p>Winery Rating: {wineInfoData.Facts_winery_rating}</p>
        <!-- </div>
      <div class="p-2 col-start-8 col-span-4 align-top"> -->
        <h3>Food Pairing Recommendations</h3>
        {#each foodPairings as foodPairing, index}
          <p>{index + 1}. {foodPairing}</p>
        {/each}
        <div class="pt-3">
          <h3>Recommended Vintages:</h3>
          {#if typeof recommendedVintages === "string"}
            <p>1. {recommendedVintages}</p>
          {:else}
            {#each recommendedVintages as recommendedVintage, index}
              <p>
                {index + 1}. {recommendedVintage}
              </p>
            {/each}
          {/if}
        </div>
      </div>
      <h3 class=" col-start-2 col-span-10 text-center self-center">
        Wine Style
      </h3>
      <div class="p-2 col-start-3 col-span-9 align-top text-start">
        {#if wineInfoData.Facts_wine_desc !== "N/A" && wineInfoData.Facts_wine_desc !== "" && wineInfoData.Facts_wine_desc !== null && wineInfoData.Facts_wine_desc !== undefined}
          <p class="text-start mb-3">
            Description: {wineInfoData.Facts_wine_desc}
          </p>
        {/if}
        {#if interestingFacts.length > 0 && interestingFacts[0] !== "N/A" && interestingFacts[0] !== "" && interestingFacts[0] !== null && interestingFacts[0] !== undefined}
          <p class="text-start">Interesting Facts:</p>
          {#each interestingFacts as interestingFact, index}
            <p class="text-start">
              {index + 1}. {interestingFact}
            </p>
          {/each}
        {/if}
        <div class="grid grid-cols-3">
          <div class="p-2 grid col-start-1 col-span-1 align-top text-start">
            <p>Style: {wineInfoData?.Style}</p>
            <p>Varietal: {wineInfoData?.Varietal}</p>
          </div>
          <div class="p-2 grid col-start-2 col-span-1 align-top">
            <div class=" p-1 text-start align-top">
              <p>Body Rating: {wineInfoData?.StyleStats_body_rating}</p>
              <p>
                Body Description: {wineInfoData?.StyleStats_body_desc}
              </p>
              <p>
                Acidity Rating: {wineInfoData?.StyleStats_acidity_rating}
              </p>
              <p>
                Acidity Description: {wineInfoData?.StyleStats_acidity_desc}
              </p>
            </div>
          </div>
          <div class="p-2 grid col-start-3 col-span-1 align-top">
            <div class=" p-1 text-start align-top">
              <p>
                Acidity: {wineInfoData?.BaseStats_acidity}
              </p>
              <p>
                Fizziness: {wineInfoData?.BaseStats_fizziness}
              </p>
              <p>
                Intensity: {wineInfoData?.BaseStats_intensity}
              </p>
              <p>
                Sweetness: {wineInfoData?.BaseStats_sweetness}
              </p>
              <p>
                Tannin: {wineInfoData?.BaseStats_tannin}
              </p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- {/each} -->

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
