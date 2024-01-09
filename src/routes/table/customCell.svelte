<script lang="ts">
  import type { BottleRecordTableSchema, BottleRecordsTableSchema } from "$lib";
  import { Label } from "$lib/components/ui/label";
  import type { BodyCell, BodyRow } from "svelte-headless-table";
  import type { Writable } from "svelte/store";

  export let value: Writable<BottleRecordsTableSchema>;
  export let row: BodyRow<BottleRecordTableSchema>;
  export let cell: BodyCell<BottleRecordTableSchema>;

  let key = (cell?.id as keyof BottleRecordTableSchema) || "";
  // console.log("🚀 ~ file: customCell.svelte:12 ~ key:", key);
  let output: any;
  $: try {
    if ($value[Number(row.id)]) output = $value[Number(row.id)][key];
  } catch (error) {
    throw new Error("Error in customCell.svelte");
  }
  if (output) console.log("🚀 ~ file: customCell.svelte:17 ~ output:", output);
  //
</script>

<Label>{output}</Label>
