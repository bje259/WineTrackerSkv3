<script lang="ts">
  import { inputCrudSchema } from "$lib/Schemas";
  import type { PageData } from "./$types";
  import { crudSchema, importSchema, importSchemaArray } from "$lib/Schemas";
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type { BottleDB, BottlesDB, User, BottleDBinput } from "$lib/types";
  import { getForm, getFormField } from "formsnap";
  import { superForm, type SuperForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { z } from "zod";
  import { FileButton } from "@skeletonlabs/skeleton";
  import { Label } from "$lib/components/ui/label";
  import type { ZodValidation } from "sveltekit-superforms";

  export let data: PageData;

  type InputCrudSchema = z.input<typeof inputCrudSchema>;

  const superFrm = superForm(data.form, {
    validators: importSchemaArray,
    dataType: "json",
  });
  const { form, message, errors, enhance } = superFrm;
  // $: console.log("🚀 ~ file: +page.svelte:12 ~ data:", data);
  const debug: Writable<boolean> = getContext("debug");
  const user: Writable<User> = getContext("user");
  // let textAreaValue: string;
  let importTextAreaValue: string;
  $: $form.UserId = $user.id ?? "";
  //$: if ($user.id) userInputValue = $user.id;
  $: if ($form?.importString) importTextAreaValue = $form.importString;
  // let value: string;
  // $: exportStringValue = data.form.data.exportString;
  // $: console.log(exportStringValue);
  // let parsedSubmitData: Writable<BottlesDB>;
  let tmpSubmitData: BottlesDB;
  // let fieldValue: Writable<string>;
  let files: FileList;

  function removeEmptyLines(dataArray: string[][]) {
    return dataArray.filter((row) => row.some((field) => field.trim() !== ""));
  }

  function onChangeHandler(e: Event): void {
    console.log("🚀 ~ file: +page.svelte:37 ~ onChangeHandler ~ e:", e);

    if (files.length === 0) {
      return; // No file selected
    }

    const file = files[0]; // Assuming you're only handling the first file
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target?.result || null;
      if (typeof fileContent === "string") {
        // Set the read content to $form.importString
        $form.importString = fileContent;
      }
    };

    reader.readAsText(file); // Read the content of the file
  }

  function transformVintage(
    str: string,
    i: number,
    row: string[],
    parseIssues: string[]
  ) {
    try {
      return z.number().or(z.string()).pipe(z.coerce.number()).parse(str);
    } catch (error) {
      if (str === "Vintage") return 0;
      console.log(
        "🚀 ~ file: +page.svelte:77 ~ transformVintage ~ error",
        error
      );
      parseIssues.push(`Row ${i} for bottle ${row[9]} has an invalid vintage.`);
      return 0;
    }
  }

  function handleSubmitParse(e: Event) {
    //get value of textarea - now handled by reactive observer importTextAreaValue
    //parse csv data in textarea
    //uncomment line below to test validation without submission normally validation is handled server side after submission
    //e.preventDefault();
    let parsed: string = importTextAreaValue;
    console.log(
      "🚀 ~ file: +page.svelte:29 ~ handleSubmitParse ~ parsed,importTextAreaValue:",
      parsed,
      importTextAreaValue
    );
    $message = undefined;
    //parse the textArea input into an array
    let parsedArray: string[][] = [];
    parsedArray = parsed.split("\n").map((row) => row.split(","));
    console.log(
      "🚀 ~ file: +page.svelte:29 ~ handleSubmitParse ~ parsedArray:",
      parsedArray
    );
    //remove empty lines
    parsedArray = removeEmptyLines(parsedArray);
    //assign value to hidden form field
    let parseIssues: string[] = [];
    tmpSubmitData = parsedArray.map((row, i) => {
      const bottle: BottleDB = {
        Consumed: row[0] || undefined,
        Name: row[1],
        Producer: row[2],
        Purchased: row[3] || undefined,
        UserId: $user.id,
        Vintage: transformVintage(row[5], i, row, parseIssues),
        // Vintage: ((str) => {
        //   try {
        //     return z.number().or(z.string()).pipe(z.coerce.number()).parse(str);
        //   } catch (error) {
        //     parseIssues.push(
        //       `Row ${i} for bottle ${row[9]} has an invalid vintage.`
        //     );
        //     return 0;
        //   }
        // })(row[4]),
        id: row[9],
      };
      if (row.length > 11) {
        parseIssues.push(
          `Row ${i} for bottle ${row[9]} has too many fields. Extra fields are ignored.`
        );
      }
      return bottle;
    });
    console.log(
      "🚀 ~ file: +page.svelte:29 ~ handleSubmitParse ~ tmpSubmitData:",
      tmpSubmitData
    );
    if (parseIssues.length > 0) {
      $message = "Parse warnings: \n" + parseIssues.join("\n");
    }
    if ((tmpSubmitData[0].Consumed = "Consumed")) tmpSubmitData.shift();

    //this works, but I should probably try catch just parse or implement an else statement to handle failure scenario
    // if (z.array(crudSchema).safeParse(tmpSubmitData).success) {
    //   $form.importArray = z.array(crudSchema).parse(tmpSubmitData);
    // }

    // the next line doesn't work becuase the type of $form.importArray is not compatible with the type of tmpSubmitData since tmpSubmitData uses zod input and $form.importArray uses zod output
    $form.importArray = tmpSubmitData;

    console.log(
      "Test validation!!!!!",
      tmpSubmitData,
      $form.importArray,
      z.array(crudSchema).safeParse(tmpSubmitData)
    );
    console.log(
      "test validation 2",
      z.array(inputCrudSchema).safeParse(tmpSubmitData)
    );
  }
  $: console.log("🚀 ~ file: +page.svelte:29 ~ $form:", $form);

  // $: $parsedSubmitData = tmpSubmitData;
  // $: console.log(
  //   "🚀 ~ file: +page.svelte:29 ~ $parsedSubmitData:",
  //   $parsedSubmitData
  // );

  // Function to download CSV data
</script>

<Form.Root
  form={superFrm}
  class="flex flex-col space-y-2 p-6"
  schema={importSchemaArray}
  let:config
  controlled
  asChild
>
  <form method="POST" use:enhance enctype="multipart/form-data">
    <input type="hidden" name="UserId" />
    {#if $errors._errors}
      <Alert.Root>
        <Alert.Title>Uh oh!</Alert.Title>
        <Alert.Description>{$errors._errors?.join(",")}</Alert.Description>
      </Alert.Root>
    {:else if $message}
      <Alert.Root>
        <Alert.Title>Heads up!</Alert.Title>
        <Alert.Description>{$message}</Alert.Description>
      </Alert.Root>
    {/if}

    <br />

    <Form.Field {config} name="importString">
      <Form.Item>
        <Form.Label>Import String:</Form.Label>
        <Form.Textarea
          placeholder="Enter import string"
          class="textarea"
          rows={10}
        />
        <!--

          on:change={($event) => {
            //const { value: tmpValue } = getFormField();
            $importTextAreaValue = value;
          }}
        />
          -->
        <Form.Description>
          Copy paste the csv data into the field above.
        </Form.Description>
        <Form.Validation />
      </Form.Item>
    </Form.Field>

    <div class="space-y-4 mt-4 mb-4">
      <Label for="importFile">Import File:</Label>

      <FileButton
        name="importFile"
        button="btn h-auto variant-ghost rounded-md"
        bind:files
        on:change={onChangeHandler}
      >
        Upload
      </FileButton>
      <Label for="importFile">Upload a csv file to import.</Label>
    </div>

    <input type="hidden" name="importArray" />
    <Form.Button class="h-auto variant-ghost" on:click={handleSubmitParse}>
      Submit Import
    </Form.Button>
    <SuperDebug data={$form} />
    <!-- <button
    type="button"
    on:click={() => {
      if (exportStringValue) downloadCSV(exportStringValue, "bottles.csv");
    }}
  >
    Download CSV
  </button> -->
  </form>
</Form.Root>
