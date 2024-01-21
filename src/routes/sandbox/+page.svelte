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
  <br />
  <br />

  <Form.Root form={data.form} schema={completionSchema} let:config debug={true}>
    <Form.Item class="flex flex-auto flex-col">
      <Form.Field {config} name="prompt" let:value>
        <Form.Label class="text-center text-3xl text-slate-300"
          >AI Playground</Form.Label
        >
        <Form.Input
          on:change={() => ($input = value)}
          placeholder="Describe your business..."
        />

        <Form.Validation />
      </Form.Field>
      <Form.Field {config} name="prompt">
        <Form.Item>
          <Form.Select>
            <Form.SelectTrigger placeholder="Select the AI prompt/scenario" />
            <Form.SelectContent>
              <Form.SelectItem value="Slogan Generator"
                >"Slogan Generator"</Form.SelectItem
              >
              <Form.SelectItem value="Scenario2">Scenario2</Form.SelectItem>
              <Form.SelectItem value="Scenario3">Scenario3</Form.SelectItem>
            </Form.SelectContent>
          </Form.Select>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <Form.Button class="mr-0" on:click={handleSubmit}>Submit</Form.Button>
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
