<script lang="ts">
  import { completionSchema } from "$lib/Schemas";
  import { onMount } from "svelte";
  import Calendarform from "./calendarform.svelte";
  import Comboboxform from "./comboboxform.svelte";
  import { useCompletion } from "ai/svelte";
  import type { Writable, Readable } from "svelte/store";
  import type { PageData } from "./$types";
  export let data: PageData;
  import * as Form from "$lib/components/ui/form";

  // let input: Writable<string>;
  // let handleSubmit: () => void;
  // let completion: Readable<string>;

  const { input, handleSubmit, completion } = useCompletion({
    api: "/api/completions",
  });

  // export let data: PageData;
</script>

<div class="flex flex-col w-3/4">
  <input class="input" title="Input (month)" type="month" />
  <br />
  <!-- <Datepickerform /> -->
  <br />
  <Calendarform />
  <br />
  <Comboboxform />

  <br />
  <br />

  <Form.Root form={data.form} schema={completionSchema} let:config debug={true}>
    <Form.Item>
      <Form.Field {config} name="prompt" let:value>
        <Form.Label>Slogan Generator</Form.Label>
        <Form.Input
          on:change={() => ($input = value)}
          placeholder="Describe your business..."
        />

        <Form.Validation />
      </Form.Field>
      <Form.Button on:click={handleSubmit}>Submit</Form.Button>
    </Form.Item>
  </Form.Root>
  <p>{$completion}</p>

  <!-- <form on:submit={handleSubmit}>
    <input
      type="text"
      bind:value={$input}
      placeholder="Describe your business..."
    />
    <button type="submit">Generate Slogan</button>
  </form>
  <p>{$completion}</p> -->
</div>
