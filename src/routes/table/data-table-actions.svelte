<script lang="ts">
  import {
    goto,
    invalidateAll,
    preloadData,
    pushState,
    replaceState,
  } from "$app/navigation";
  import { page } from "$app/stores";
  import { crudSchema } from "$lib";
  import EditBottle from "$lib/EditBottle.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  import type { User, BottleDB, BottleRecordSchema } from "$lib";
  import type {
    BottleRecordTableSchema,
    BottleRecordsTableSchema,
    BottleRecordsSchema,
  } from "$lib/types";
  import { MoreHorizontal } from "lucide-svelte";

  import { getContext, onMount, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { superForm, type SuperForm } from "sveltekit-superforms/client";
  import { number, z } from "zod";

  export let dialogBottle: Writable<string>;
  export let BottleId: string;
  export let dataStore: Writable<BottleRecordsTableSchema>;
  export let updateData: (
    rowDataId: string,
    newValue: BottleRecordTableSchema | null
  ) => void;
  const user: Writable<User> = getContext("user");
  let openDDL = writable<boolean>(false);
  // let editBottleDialog2 = writable<boolean>(false);
  let editBottleDialog2 = false;
  setContext("editBottleDialog2", editBottleDialog2);
  let editBottleInit = true;
  let theForm2: Writable<z.infer<typeof crudSchema>>, message2, errors2;
  let formData2: SuperForm<typeof crudSchema>;
  let bottles = $page.data.bottlesDB as BottleRecordsSchema;
  let bottles2: BottleRecordsSchema;

  function prepTableData(
    bottles: BottleRecordsSchema
  ): BottleRecordsTableSchema {
    return bottles.map((bottle: BottleRecordSchema) => {
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
    });
  }

  $: $dataStore = prepTableData(bottles);

  function getIndex(BottleId: string): number {
    const result = $dataStore.findIndex(
      (bottle) => bottle.BottleId === BottleId
    );
    // console.log(
    //   "🚀 ~ file: data-table-actions.svelte:47 ~ getIndex ~ BottleId,result:",
    //   BottleId,
    //   result
    // );
    return result;
  }

  // $: $dataStore = prepTableData(bottles);

  let currIndex = getIndex(BottleId).toString();

  $: bottles = $page.state.bottlePreLoad?.bottlesDB || bottles;

  let messageStore = "Listening";

  $: if ($dialogBottle === BottleId)
    console.log("Reactive message store: ", BottleId, messageStore);

  $: if ($dialogBottle === BottleId) {
    console.log("Reactive dialogBottle", BottleId, $dialogBottle);
    // console.log(
    //   "Reactive bottledetails",
    //   (bottles as BottlesDB).find((bottle: BottleDB) => bottle.id === BottleId)
    // );
  }

  async function onSubmissionSuccess(deleteBottle?: string) {
    console.log(
      "onSubmissionSuccess triggered",
      BottleId,
      deleteBottle,
      $dialogBottle
    );
    await preloadData("/bottles").then((result) => {
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
          bottles2 = [...bottles].filter(
            (bottle) => bottle.id !== deleteBottle
          );
          bottles = bottles2;
          let temp: BottleRecordsSchema = $page.data.bottlesDB;
          temp.splice(Number(currIndex), 1);

          // $dataStore = $dataStore.filter(
          //   (bottle) => bottle.id !== deleteBottle
          // );
          // updateData(getIndex(deleteBottle).toString(), null);
        }
        replaceState("/table", { bottlePreLoad: result.data });
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
        if (result.data.bottlesDB) bottles = result.data.bottlesDB;
        // console.log(
        //   "🚀 ~ file: +page.svelte:76 after push ~ result.data,page.data,page.state:",
        //   result.data,
        //   $page.data,
        //   $page.state
        // );
        messageStore = "Listening";
        editBottleDialog2 = false;
        if (deleteBottle) {
          // console.log(
          //   "🚀 ~ file: +page.svelte:85 ~ onSubmissionSuccess ~ deleteBottle done after historyback:",
          //   deleteBottle
          // );
          bottles2 = [...bottles].filter(
            (bottle) => bottle.id !== deleteBottle
          );
          bottles = bottles2;

          // $dataStore = $dataStore.filter(
          //   (bottle) => bottle.id !== deleteBottle
          // );
          // updateData(getIndex(deleteBottle).toString(), null);
          // console.log(
          //   "🚀 ~ file: +page.svelte:91 ~ pre replacestate ~ result,page,bottles2,bottles:",
          //   result,
          //   $page,
          //   bottles2,
          //   bottles
          // );
          result.data.bottlesDB = bottles2;
          replaceState("/table", { bottlePreLoad: result.data });
          replaceState("/bottles/[[]]", { bottlePreLoad: result.data });
          replaceState("/bottles", { bottlePreLoad: result.data });
          // console.log(
          //   "🚀 ~ file: +page.svelte:99 ~ post replacestate ~ result:",
          //   result,
          //   $page
          // );
        }
      }
    });
  }

  // onMount(async () => {
  //   try {
  //     const result = await preloadData("/bottles");
  //     if (result.type === "loaded" && result.status === 200) {
  //       pushState("/bottles", { bottlePreLoad: result.data });
  //       console.log(
  //         "🚀 ~ file: +page.svelte:69 ~ onClickFunction - (loaded=true) Setting init=true result.data:",
  //         result.data
  //       );
  //       console.log(
  //         "🚀 ~ file: +page.svelte:40 ~ onMount ~ editBottleDialog2,editBottleInit,theForm2",
  //         editBottleDialog2,
  //         editBottleInit,
  //         theForm2
  //       );
  //     } else {
  //       console.log("Failed to load bottles:", result);
  //       throw error(418, "Failed to load bottles");
  //     }
  //   } catch (e) {
  //     console.error("Error during preload:", e);
  //   }
  // });

  async function onBottleEditClick(
    e: MouseEvent & { currentTarget: HTMLElement }
  ): Promise<void> {
    //console.log("🚀 ~ file: data-table-actions.svelte:29 ~ currentTarget:", e);
    // Cast the current target to a type that may have an href
    let target = e?.currentTarget as HTMLAnchorElement;
    // prevent full navigation
    e.preventDefault();

    let href = target?.href || `/bottles/${BottleId}`;
    // console.log("🚀 ~ file: +page.svelte:60 ~ onClickFunction- href:", href);
    // run `load` functions (or rather, get the result of the `load` functions
    // that are already running because of `data-sveltekit-preload-data`)
    await preloadData(href)
      .then((result) => {
        // console.log(
        //   "🚀 ~ file: +page.svelte:64 ~ onClickFunction ~ result",
        //   result
        // );

        if (result.type === "loaded" && result.status === 200) {
          pushState(href, { bottlePreLoad: result.data });
          // if ($page.state.bottlePreLoad?.form?.data?.id) {
          //   editBottleDialog2 = true;
          //   editBottleInit = false;
          //   console.log(
          //     "🚀 ~ file: +page.svelte:75 ~ onClickFunction - (loaded=true) Setting result.data,state,init,dialog:",
          //     result.data,
          //     $page.state,
          //     editBottleInit,
          //     editBottleDialog2
          //   );
          // }
          // editBottleDialog2 = true;
          $dialogBottle = BottleId;
          editBottleInit = true;
          if ($page.state.bottlePreLoad?.form?.data?.id) editBottleInit = true;
          console.log(
            "🚀 ~ file: +page.svelte:75 ~ onClickFunction - (loaded=true) Setting result.data,state,init,dialog:",
            result.data,
            $page.state,
            editBottleInit,
            editBottleDialog2
          );

          // if ($page.state.bottlePreLoad?.form?.data?.id) {

          //   console.log(
          //     "🚀 ~ file: data-table-actions.svelte:81 ~ .then ~ editBottleInit, editBottleDialog2:",
          //     $editBottleInit,
          //     $editBottleDialog2
          //   );
          // }
          // $editBottleDialog2 = true;
        } else {
          //goto(href);
          console.log("🚀 ~ failed to onclick condition", result);
          // editBottleDialog2 = false;
          // $editBottleInit = true;
          console.log(
            "🚀 ~ file: data-table-actions.svelte:89 ~ .then ~ editBottleInit, editBottleDialog2:",
            editBottleInit,
            editBottleDialog2
          );
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during preloadData or in the then block
        console.error(error);
      });
    //console.log("🚀 ~ file: +page.svelte:73 ~ href:", href);
  }

  $: if (BottleId && $page.state.bottlePreLoad?.form?.data?.id === BottleId) {
    console.log(
      "🚀 ~ file: +page.svelte:214 ReactiveIf - state ~ ($page, editBottleInit, editBottleDialog2:",
      $page,
      editBottleInit,
      editBottleDialog2
    );
    // console.log(
    //   "Line 107: ReactiveIf - state - Current boolean editBottleInit,editBottleDialog2:",
    //   $editBottleInit,
    //   $editBottleDialog2
    // );
    // console.log("pagestate form", $page.state.bottlePreLoad.form);
    formData2 = superForm($page.state.bottlePreLoad?.form, {
      validators: crudSchema,
      resetForm: true,
      warnings: {
        duplicateId: false,
      },
    }) as SuperForm<typeof crudSchema>;

    ({ form: theForm2, message: message2, errors: errors2 } = formData2);

    if (editBottleInit) {
      editBottleDialog2 = true;
      editBottleInit = false;
      console.log(
        "🚀 ~ file: +page.svelte:239 ReactiveIf - state ~ ($page, editBottleInit, editBottleDialog2:",
        $page,
        editBottleInit,
        editBottleDialog2
      );
    }

    // console.log(
    //   "🚀 ~ file: +page.svelte:97 ~ ReactiveIf - state - form: theForm2, message: message2, errors: errors2 } = formData2): and bottles",
    //   $theForm2,
    //   $message2,
    //   $errors2,
    //   formData2,
    //   $page.state
    // );

    // if ($editBottleInit) {
    //   $editBottleDialog2 = true;
    //   $editBottleInit = false;
    //   console.log(
    //     "🚀 ~ file: data-table-actions.svelte:132 ~ .then ~ editBottleInit, editBottleDialog2:",
    //     $editBottleInit,
    //     $editBottleDialog2
    //   );
    // }
  } else {
    // if ($editBottleInit) {
    //   $editBottleDialog2 = false;
    //   $editBottleInit = true;
    //   history.back();
    // }
  }

  $: if ($dialogBottle === BottleId) {
    messageStore = $page?.form?.form?.message?.deletedBottle
      ? $page?.form?.form?.message?.deletedBottle
      : $page?.form?.form?.message ?? "Listening";
  }

  $: if (
    $dialogBottle === BottleId &&
    currIndex !== "-1" &&
    (messageStore.includes("bottle updated") ||
      messageStore.includes("bottle created") ||
      messageStore.includes("bottle deleted"))
  ) {
    // console.log(
    //   "🚀 ~ file: +page.svelte:88 ~ messageStore.includes ~ messageStore,page.data.bottlesDB:",
    //   messageStore
    // );
    const tmpPrepBottles = prepTableData([bottles[Number(currIndex)]]);
    updateData(currIndex, tmpPrepBottles[0]);
    messageStore = "Listening";
    onSubmissionSuccess();
    // updateData(currIndex, bottles[Number(currIndex)]);
  } else if (
    $dialogBottle === BottleId &&
    messageStore !== "Listening" &&
    currIndex !== "-1"
  ) {
    messageStore = "Listening";

    // console.log(
    //   "🚀 ~ file: +page.svelte:93 ~ messageStore !== Listening ~ deletedBottleID:",
    //   deletedBottleID
    // );

    updateData(currIndex, null);
    onSubmissionSuccess(currIndex);
    // updateData(currIndex, null);
    // bottles2 = [...bottles2].filter((bottle) => bottle.id !== deletedBottleID);
    // console.log(
    //   "🚀 ~ file: +page.svelte:96 ~ messageStore !== Listening ~ bottles2:",
    //   bottles2
    // );

    //$editBottleDialog = false;
  }

  // $: if ($dialogBottle === BottleId)
  //   console.log(
  //     "Reactive datastore values (filtered):",
  //     $dataStore[Number(currIndex)]
  //   );
</script>

<DropdownMenu.Root bind:open={$openDDL}>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative w-8 h-8 p-0"
    >
      <!-- past in above to uncomment
      on:mouseenter={async (e) => {
        console.log("preview onmouseenter triggered");
        await onBottleEditClick(e);
      }} -->
      <span class="sr-only">Open menu</span>
      <MoreHorizontal class="w-4 h-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => navigator.clipboard.writeText(BottleId)}
      >
        Copy bottle ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <a
        href="/bottles/{BottleId}"
        on:click={async (e) => {
          console.log(
            "🚀 ~ file: +page.svelte:142 ~ on:click ~ BottleId",
            BottleId
          );
          e.preventDefault();
          const hrefString = `/bottles/${BottleId}`;
          await onBottleEditClick(e);
        }}
      >
        Edit Bottle
      </a>
    </DropdownMenu.Item>
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<div class="grid grid-cols-2 w-full gap-7">
  <Dialog.Root
    open={editBottleDialog2}
    onOpenChange={async (open) => {
      if (!open && $dialogBottle === BottleId) {
        // $editBottleDialog2 = false;
        // editBottleInit = true;
        console.log(
          "🚀 ~ file: +page.svelte:180 onOpenChange ~ not open $page:",
          $page
        );
        editBottleDialog2 = false;
        // invalidateAll();
        history.back();
        //console.log("swapping init to ture");
      }
    }}
  >
    <Dialog.Trigger let:builder asChild>
      <Button
        builders={[builder]}
        on:click={async (e) => {
          e.preventDefault();
          const hrefString = `/bottles/${BottleId}`;
          await onBottleEditClick(e);
        }}
        class="hidden btn bg-gradient-to-br variant-gradient-secondary-tertiary col-span-2"
      >
        Create New
      </Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <EditBottle formData={formData2} theForm={theForm2} currentUser={user} />
    </Dialog.Content>
  </Dialog.Root>
</div>
