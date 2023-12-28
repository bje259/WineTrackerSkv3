<script lang="ts">
  import type { PageData } from "./$types";
  import { exportSchema } from "$lib/Schemas";
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type { User } from "$lib/types";
  import { getForm } from "formsnap";

  export let data: PageData;
  // $: console.log("🚀 ~ file: +page.svelte:12 ~ data:", data);
  const debug: Writable<boolean> = getContext("debug");
  const user: Writable<User> = getContext("user");
  $: exportStringValue = data.form.data.exportString;
  // $: console.log(exportStringValue);

  // Function to download CSV data
  function downloadCSV(csvData: string, filename: string) {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<Form.Root
  form={data.form}
  class="flex flex-col flex-auto space-y-2 p-6"
  schema={exportSchema}
  let:config
  debug={$debug}
  let:message
  let:errors
>
  <input type="hidden" name="UserId" bind:value={$user.id} />
  {#if errors._errors}
    <Alert.Root>
      <Alert.Title>Uh oh!</Alert.Title>
      <Alert.Description>{errors._errors?.join(",")}</Alert.Description>
    </Alert.Root>
  {:else if message}
    <Alert.Root>
      <Alert.Title>Heads up!</Alert.Title>
      <Alert.Description>{message}</Alert.Description>
    </Alert.Root>
  {/if}

  <br />

  <Form.Field {config} name="exportString">
    <Form.Item>
      <Form.Label>Export String:</Form.Label>
      <Form.Textarea
        placeholder="Export String Loading"
        class="textarea"
        rows={10}
      />
      <Form.Description>
        Copy paste the csv export into a new file and save it as a .csv.
      </Form.Description>
      <Form.Validation />
    </Form.Item>
  </Form.Field>
  <Form.Button
    class="h-auto variant-ghost"
    on:click={(e) => {
      e.preventDefault();
      if (exportStringValue) downloadCSV(exportStringValue, "bottles.csv");
    }}
  >
    Download CSV
  </Form.Button>

  <!-- <button
    type="button"
    on:click={() => {
      if (exportStringValue) downloadCSV(exportStringValue, "bottles.csv");
    }}
  >
    Download CSV
  </button> -->
</Form.Root>
