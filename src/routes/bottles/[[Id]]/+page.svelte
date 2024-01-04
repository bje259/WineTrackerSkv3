<script lang="ts">
  import EditBottle from "$lib/EditBottle.svelte";
  import { getContext } from "svelte";
  import { z } from "zod";
  //import EditBottle from '$lib/EditBottle.svelte';
  //import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from "./$types";
  import type { Writable } from "svelte/store";
  //import TestForm from './TestForm3.svelte';
  import type { BottleDB, User } from "$lib/types";
  import { superForm } from "sveltekit-superforms/client";
  import { crudSchema } from "$lib/Schemas";
  import { page } from "$app/stores";
  import type { AnyZodObject } from "zod";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { buttonVariants } from "$lib/components/ui/button";
  import {
    preloadData,
    pushState,
    goto,
    replaceState,
    invalidateAll,
  } from "$app/navigation";
  import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
  import editBottlePage from "./+page.svelte";
  import Alert from "$components/ui/alert/alert.svelte";
  import { writable } from "svelte/store";
  import type { SuperForm } from "sveltekit-superforms/client";
  export let data: PageData;
  const user: Writable<User> = getContext("user");
  let bottles = data.bottlesDB;
  const debug: Writable<boolean> = getContext("debug");
  let editTableDialog: Writable<boolean> = getContext("editTableDialog");
  // const formData = superForm(data.form, {
  //   validators: crudSchema,
  //   resetForm: true,
  //   // onError({ result }) {
  //   //   $message = result.error.message;
  //   //   console.log("error", result.error.message);
  //   // },
  // });
  let editBottleDialog = writable<boolean>(false);
  let editBottleInit = writable<boolean>(true);
  $: bottles = $page.state.bottlePreLoad?.bottlesDB || bottles;

  async function onSubmissionSuccess(deleteBottle?: string) {
    const result = await preloadData("/bottles");
    // console.log(
    //   "🚀 ~ file: +page.svelte:50 ~ onSubmissionSuccess ~ result:",
    //   result
    // );
    if (result.type === "loaded" && result.status === 200) {
      // console.log(
      //   "🚀 ~ file: +page.svelte:54 ~ pre replacestate ~ result:",
      //   result,
      //   $page
      // );
      if (deleteBottle) {
        bottles2 = [...bottles].filter((bottle) => bottle.id !== deleteBottle);
        bottles = bottles2;
        result;
      }
      replaceState("", { bottlePreLoad: result.data });
      replaceState("/bottles/[[]]", { bottlePreLoad: result.data });
      replaceState("/bottles", { bottlePreLoad: result.data });
      // console.log(
      //   "🚀 ~ file: +page.svelte:58 ~ post replacestate ~ result:",
      //   result,
      //   $page
      // );
      history.back();
      // console.log(
      //   "🚀 ~ file: +page.svelte:60 ~ post history back ~ result:",
      //   result,
      //   $page
      // );
      //pushState("/bottles", { bottlePreLoad: result.data });
      bottles = result.data.bottlesDB;
      // console.log(
      //   "🚀 ~ file: +page.svelte:76 after push ~ result.data,page.data,page.state:",
      //   result.data,
      //   $page.data,
      //   $page.state
      // );
      messageStore = "Listening";
      $editBottleDialog = false;
      if (deleteBottle) {
        // console.log(
        //   "🚀 ~ file: +page.svelte:85 ~ onSubmissionSuccess ~ deleteBottle done after historyback:",
        //   deleteBottle
        // );
        bottles2 = [...bottles].filter((bottle) => bottle.id !== deleteBottle);
        bottles = bottles2;
        // console.log(
        //   "🚀 ~ file: +page.svelte:91 ~ pre replacestate ~ result,page,bottles2,bottles:",
        //   result,
        //   $page,
        //   bottles2,
        //   bottles
        // );
        result.data.bottlesDB = bottles2;
        replaceState("", { bottlePreLoad: result.data });
        replaceState("/bottles/[[]]", { bottlePreLoad: result.data });
        replaceState("/bottles", { bottlePreLoad: result.data });
        // console.log(
        //   "🚀 ~ file: +page.svelte:99 ~ post replacestate ~ result:",
        //   result,
        //   $page
        // );
      }
    }
  }

  async function onBottleEditClick(
    e: MouseEvent & { currentTarget: HTMLElement }
  ) {
    // bail if opening a new tab
    if (e.metaKey || e.ctrlKey) return;

    // Cast the current target to a type that may have an href
    const target = e.currentTarget as HTMLAnchorElement | HTMLButtonElement;
    // Check if the element has an href property
    if (!("href" in target)) return;

    // prevent full navigation
    e.preventDefault();

    const { href } = target;
    // console.log("🚀 ~ file: +page.svelte:60 ~ onClickFunction- href:", href);

    // run `load` functions (or rather, get the result of the `load` functions
    // that are already running because of `data-sveltekit-preload-data`)
    const result = await preloadData(href);

    if (result.type === "loaded" && result.status === 200) {
      pushState(href, { bottlePreLoad: result.data });
      // console.log(
      //   "🚀 ~ file: +page.svelte:69 ~ onClickFunction - (loaded=true) Setting init=true result.data:",
      //   result.data
      // );
      $editBottleInit = true;
      // $editBottleDialog = true;
    } else {
      goto(href);
    }
    //console.log("🚀 ~ file: +page.svelte:73 ~ href:", href);
  }
  let bottles2: BottleDB[];
  $: bottles2 = $page.state.bottlePreLoad?.bottlesDB || bottles;
  //$: bottles2 = $page?.data?.bottlesDB || bottles;
  // $: console.log(
  //   "🚀 ~ file: +page.svelte:46 ~reactive monitor  bottles, bottles2:",
  //   bottles,
  //   bottles2
  // );
  let theForm2: Writable<z.infer<typeof crudSchema>>, message2, errors2;
  let formData2: SuperForm<typeof crudSchema>;
  //message handler
  $: messageStore = $page?.form?.form?.message?.deletedBottle
    ? $page?.form?.form?.message?.deletedBottle
    : $page?.form?.form?.message ?? "Listening";
  // $: console.log("🚀 ~ file: +page.svelte:85 ~ messageStore:", messageStore);

  $: if (
    messageStore.includes("bottle updated") ||
    messageStore.includes("bottle created") ||
    messageStore.includes("bottle deleted")
  ) {
    // console.log(
    //   "🚀 ~ file: +page.svelte:88 ~ messageStore.includes ~ messageStore,page.data.bottlesDB:",
    //   messageStore
    // );
    onSubmissionSuccess();
  } else if (messageStore !== "Listening") {
    const deletedBottleID = messageStore;
    // console.log(
    //   "🚀 ~ file: +page.svelte:93 ~ messageStore !== Listening ~ deletedBottleID:",
    //   deletedBottleID
    // );
    onSubmissionSuccess(deletedBottleID);
    // bottles2 = [...bottles2].filter((bottle) => bottle.id !== deletedBottleID);
    // console.log(
    //   "🚀 ~ file: +page.svelte:96 ~ messageStore !== Listening ~ bottles2:",
    //   bottles2
    // );

    //$editBottleDialog = false;
  }

  // $: formInput = $page?.state?.bottlePreLoad?.form ?? data.form;

  // formData2 = superForm(formInput, {
  //       validators: crudSchema,
  //       resetForm: true,
  //       warnings: {
  //         duplicateId: false,
  //       },
  //     }) as SuperForm<typeof crudSchema>;

  $: if ($page.state.bottlePreLoad) {
    // console.log(
    //   "🚀 ~ file: +page.svelte:84 ReactiveIf - state ~ ($page:",
    //   $page
    // );
    // console.log(
    //   "Line 88: ReactiveIf - state - Current boolean is",
    //   $editBottleDialog
    // );
    // console.log("pagestate form", $page.state.bottlePreLoad.form);
    formData2 = superForm($page.state.bottlePreLoad.form, {
      validators: crudSchema,
      resetForm: true,
      warnings: {
        duplicateId: false,
      },
    }) as SuperForm<typeof crudSchema>;

    ({ form: theForm2, message: message2, errors: errors2 } = formData2);
    // console.log(
    //   "🚀 ~ file: +page.svelte:97 ~ ReactiveIf - state - form: theForm2, message: message2, errors: errors2 } = formData2): and bottles",
    //   $theForm2,
    //   $message2,
    //   $errors2,
    //   formData2,
    //   bottles
    // );

    if ($editBottleInit) {
      // console.log(
      //   "🚀 ~ file: +page.svelte:108 ReactiveIf State Init=true setting boolean to true ~ current booleans-Dialog,Init:",
      //   $editBottleDialog,
      //   $editBottleInit
      // );
      $editBottleDialog = true;
      $editBottleInit = false;
    }
  } else {
    // console.log(
    //   "🚀 ~ file: +page.svelte:106 ReactiveIf - no state ~ ($page:",
    //   $page
    // );
    // console.log(
    //   "Line 110: ReactiveIf - no state - Current boolean is",
    //   $editBottleDialog
    // );
    formData2 = superForm(data.form, {
      validators: crudSchema,
      resetForm: true,
      warnings: {
        duplicateId: false,
      },
    }) as SuperForm<typeof crudSchema>;
    // console.log("data.form", data.form);
    ({ form: theForm2, message: message2, errors: errors2 } = formData2);
    // console.log(
    //   "🚀 ~ file: +page.svelte:119 ReactiveIf - no state ~ form: theForm2, message: message2, errors: errors2 } = formData2): and bottles",
    //   $theForm2,
    //   $message2,
    //   $errors2,
    //   formData2,
    //   bottles
    // );
  }
  // const { form: theForm, message, errors } = formData;
</script>

<!-- Start Form Header-->
<div class="container h-full mx-auto flex justify-center">
  <div class="px-4 text-center flex flex-col items-center space-y-2">
    <h1 class="h1">Wine Tracker!!!!</h1>
    {#if $message2}
      <h3 class:invalid={$page.status >= 400}>{$message2}</h3>
    {/if}
    <h3>Bottles</h3>
    <div class="grid grid-cols-2 w-full gap-7">
      <div class="bottles flex flex-wrap col-span-2">
        {#each bottles2 as bottle}
          <a
            class={buttonVariants({ variant: "outline" })}
            href="/bottles/{bottle.id}"
            on:click={onBottleEditClick}
          >
            {bottle.Name}</a
          >
          <!-- <a
            class={buttonVariants({ variant: "outline" })}
            href="/bottles/{bottle.id}"
            on:click={() => ($editBottleDialog = true)}
          >
            {bottle.Name}</a
          > -->
        {/each}
      </div>
      <div class="flex text-start">
        {#if $debug}<SuperDebug
            data={{ form: $theForm2, $errors2, $message2, $editTableDialog }}
            collapsible
          />{/if}
      </div>
      <Dialog.Root
        open={$editBottleDialog}
        onOpenChange={async (open) => {
          if (!open) {
            // const result = await preloadData("/bottles");
            // if (result.type === "loaded" && result.status === 200) {
            //   pushState("/bottles", { bottlePreLoad: result.data });
            //   bottles = result.data.bottlesDB;
            //   console.log("🚀 ~ file: +page.svelte:112 ~ data:", result.data);
            // }
            $editBottleDialog = false;
            console.log(
              "🚀 ~ file: +page.svelte:180 onOpenChange ~ not open $page:",
              $page
            );
            //invalidateAll();
            history.back();
          }
        }}
      >
        <Dialog.Trigger let:builder asChild>
          <Button
            builders={[builder]}
            href="/bottles"
            on:click={onBottleEditClick}
            class="btn bg-gradient-to-br variant-gradient-secondary-tertiary grid col-span-2"
          >
            <!-- <Button
            builders={[builder]}
            href="/bottles"
            on:click={() => ($editBottleDialog = true)}
            class="btn bg-gradient-to-br variant-gradient-secondary-tertiary grid col-span-2"
          > -->
            Create New
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <!-- <EditBottle
            formData={formData2 || formData}
            bottles={bottles2}
            theForm={theForm2}
            currentUser={user}
          /> -->
          <EditBottle
            formData={formData2}
            theForm={theForm2}
            currentUser={user}
          />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>

  <!-- form Code starts here-->
</div>

<!-- form Code ends here-->
<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: flex-start;
    margin-bottom: 2em;
  }

  .bottles {
    columns: 1 150px;
  }

  .bottles > * {
    display: block;
    white-space: nowrap;
    overflow-x: hidden;
  }
</style>
