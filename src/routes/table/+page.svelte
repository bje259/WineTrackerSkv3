<script lang="ts">
  import type { PageData } from "./$types";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type { User } from "$lib/types";
  export let data: PageData;
  import * as Table from "$lib/components/ui/table";
  import { bottleRecordSchema, bottleRecordTableSchema } from "$lib/Schemas";
  import { z } from "zod";
  type BottleRecordTableSchema = z.infer<typeof bottleRecordTableSchema>;
  type BottleRecordSchema = z.infer<typeof bottleRecordSchema>;
  import DataTable from "./data-table.svelte";

  const dataForTable: BottleRecordTableSchema[] = data.bottlesDB.map(
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
</script>

<div class="container mx-auto py-10">
  <DataTable data={dataForTable} />
</div>

<!-- form Code starts here-->
