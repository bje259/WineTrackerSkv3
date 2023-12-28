<script lang="ts">
  import type { PageData } from "./$types";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type { User } from "$lib/types";
  export let data: PageData;
  import * as Table from "$lib/components/ui/table";
  import { bottleRecordSchema } from "$lib/Schemas";
  import { z } from "zod";
  type BottleRecordSchema = z.infer<typeof bottleRecordSchema>;
  import DataTable from "./data-table.svelte";
</script>

<div class="container mx-auto py-10">
  <DataTable data={data.bottlesDB} />
</div>
