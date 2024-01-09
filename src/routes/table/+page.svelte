<script lang="ts">
  import type { PageData } from "./$types";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type {
    User,
    BottleRecordTableSchema,
    BottleRecordsTableSchema,
    BottleRecordSchema,
  } from "$lib/types";
  export let data: PageData;
  import * as Table from "$lib/components/ui/table";
  import { bottleRecordSchema, bottleRecordTableSchema } from "$lib/Schemas";
  import { z } from "zod";

  import DataTable from "./data-table.svelte";
  import { Button } from "$components/ui/button";

  let dataForTable: BottleRecordTableSchema[] = data.bottlesDB.map(
    (bottle: BottleRecordSchema) => {
      return {
        id: undefined,
        BottleId: bottle.id,
        Name: bottle.Name,
        Producer: bottle.Producer,
        Vintage: bottle.Vintage,
        Purchased: bottle.Purchased,
        Consumed: bottle.Consumed,
        created: bottle.created,
        updated: bottle.updated,
      };
    }
  );

  const dataStore = writable<BottleRecordsTableSchema>([]);

  $: if (dataForTable) $dataStore = dataForTable;
</script>

<Button
  on:click={async () => {
    const response = await fetch("/api/testCreate", { method: "POST" });
    console.log(
      "🚀 ~ file: +page.svelte:39 ~ on:click={ ~ response:",
      response
    );
  }}>Button</Button
>
<div class="container mx-auto py-10">
  {#if dataForTable}
    <DataTable data={dataForTable} {dataStore} />
  {/if}
</div>

<!-- form Code starts here-->
