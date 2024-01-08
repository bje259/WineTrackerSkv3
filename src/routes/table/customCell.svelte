<script lang="ts">
  import type { IndexRecord } from "$lib";
  import { Label } from "$lib/components/ui/label";
  import type { BodyCell, BodyRow } from "svelte-headless-table";
  import type { Writable } from "svelte/store";

  export let value: Writable<IndexRecord[]>;
  export let row: BodyRow<IndexRecord>;
  export let cell: BodyCell<IndexRecord>;

  let key = (cell.id as keyof IndexRecord) || "";
  console.log("🚀 ~ file: customCell.svelte:12 ~ key:", key);
  let output: any;
  if ($value) {
    const index = cell.row.id;
    console.log("🚀 ~ file: customCell.svelte:16 ~ index:", index);
    output = $value[Number(row.id)][key];
  }
  console.log("🚀 ~ file: customCell.svelte:17 ~ output:", output);
  //
</script>

<Label>{output}</Label>
