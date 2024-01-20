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
  import { getFlash } from "sveltekit-flash-message";
  import { page } from "$app/stores";
  import { PUBLIC_PB_HOST } from "$env/static/public";
  import PocketBase from "pocketbase";
  import pb from "$lib/browserclient";
  const flash = getFlash(page);
  export let data: PageData;
  let inputValue: string;
  type InputCrudSchema = z.input<typeof inputCrudSchema>;

  const superFrm = superForm(data.form, {
    validators: importSchemaArray,
    dataType: "json",
  });
  const { form, message, errors, enhance, tainted } = superFrm;
  // $: console.log("🚀 ~ file: +page.svelte:12 ~ data:", data);
  const debug: Writable<boolean> = getContext("debug");
  const user: Writable<User> = getContext("user");
  // let textAreaValue: string;
  let importTextAreaValue: string;
  $: if (!data?.admin?.id)
    form.update(
      ($form) => {
        $form.UserId = $user.id ?? "";
        return $form;
      },
      { taint: false }
    );
  //$: $form.UserId = $user.id ?? "";
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
    $form.importString = "";
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
      const NameIndex = row.indexOf("Name");
      $flash = {
        type: "error",
        message: `Row ${i} for bottle ${row[NameIndex]} has an invalid vintage.`,
      };
      parseIssues.push(
        `Row ${i} for bottle ${row[NameIndex]} has an invalid vintage.`
      );
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

    const headerRow = parsedArray[0];
    const ConsumedIndex = headerRow.indexOf("Consumed");
    const NameIndex = headerRow.indexOf("Name");
    const ProducerIndex = headerRow.indexOf("Producer");
    const PurchasedIndex = headerRow.indexOf("Purchased");
    const VintageIndex = headerRow.indexOf("Vintage");
    const idIndex = headerRow.indexOf("id");
    const userIndex = headerRow.indexOf("UserId");
    const VarietalIndex = headerRow.indexOf("Varietal");
    const VineyardLocIndex = headerRow.indexOf("VineyardLoc");
    const VineyardNameIndex = headerRow.indexOf("VineyardName");
    const BinIndex = headerRow.indexOf("Bin");
    const NotesIndex = headerRow.indexOf("Notes");
    console.log(
      "🚀 ~ file: +page.svelte:29 ~ handleSubmitParse ~ headerRow:",
      headerRow
    );
    console.log(
      "🚀 ~ file: +page.svelte:29 ~ handleSubmitParse ~ ConsumedIndex,NameIndex,ProducerIndex,PurchasedIndex,VintageIndex,idIndex:",
      ConsumedIndex,
      NameIndex,
      ProducerIndex,
      PurchasedIndex,
      VintageIndex,
      idIndex,
      userIndex,
      VarietalIndex,
      VineyardLocIndex,
      VineyardNameIndex,
      BinIndex,
      NotesIndex
    );

    let parseIssues: string[] = [];
    tmpSubmitData = parsedArray.map((row, i) => {
      const bottle: BottleDB = {
        Consumed: row[ConsumedIndex] || undefined,
        Name: row[NameIndex],
        Producer: row[ProducerIndex],
        Purchased: row[PurchasedIndex] || undefined,
        UserId: row[userIndex] || $user.id,
        Vintage: transformVintage(row[VintageIndex], i, row, parseIssues),
        Varietal: row[VarietalIndex] || undefined,
        VineyardLoc: row[VineyardLocIndex] || undefined,
        VineyardName: row[VineyardNameIndex] || undefined,
        Bin: row[BinIndex] || undefined,
        Notes: row[NotesIndex] || undefined,
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
        id: row[idIndex],
      };
      if (row.length > 15) {
        parseIssues.push(
          `Row ${i} for bottle ${row[NameIndex]} has too many fields. Extra fields are ignored.`
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
      $flash = {
        type: "error",
        message: $message,
      };
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
  class="flex flex-col space-y-2 p-6 w-[90%]"
  schema={importSchemaArray}
  let:config
  controlled
  asChild
>
  <form
    method="POST"
    use:enhance
    enctype="multipart/form-data"
    class="flex flex-col flex-auto space-y-2 p-6"
  >
    {#if data.admin?.id}
      <Form.Field {config} name="UserId">
        <Form.Item>
          <Form.Label>User:</Form.Label>
          <Form.Input
            placeholder="Select a user"
            class="select"
            bind:value={inputValue}
            on:change={async (e) => {
              //const { value: tmpValue } = getFormField();
              // const res = await fetch(`/api/users/${inputValue}`).then((res) =>
              //   res.json()
              // );
              // $user = res.json();
              // $user = inputValue;
            }}
          />
          <Form.Description>
            Select a user to import bottles for.
          </Form.Description>
          <Form.Validation />
        </Form.Item>
      </Form.Field>
    {:else}
      <input type="hidden" name="UserId" />
    {/if}
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
    {#if $debug}
      <SuperDebug data={{ $form, $tainted }} />
    {/if}
    <!--
    <SuperDebug data={$form} />
    -->

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
