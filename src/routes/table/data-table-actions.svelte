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
  import * as DataTablePlugins from "svelte-headless-table/plugins";
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
  import { type UsersResponse } from "$lib/WineTypes.js";
  export let dialogBottle: Writable<string>;
  export let BottleId: string;
  export let dataStore: Writable<BottleRecordsTableSchema>;
  export let updateData: (
    rowDataId: string,
    newValue: BottleRecordTableSchema | null
  ) => void;
  const user: Writable<UsersResponse> = getContext("user");
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
        Varietal: bottle.Varietal,
        VineyardLoc: bottle.VineyardLoc,
        VineyardName: bottle.VineyardName,
        Bin: bottle.Bin,
        Notes: bottle.Notes,
      };
    });
  }

  $: $dataStore = prepTableData(bottles);

  function getIndex(BottleId: string): number {
    const result = $dataStore.findIndex(
      (bottle) => bottle.BottleId === BottleId
    );

    return result;
  }

  // $: $dataStore = prepTableData(bottles);

  let currIndex = getIndex(BottleId).toString();

  $: bottles = $page.data.bottlesDB || bottles;

  let messageStore = "Listening";

  $: if ($dialogBottle === BottleId)
    console.log("Reactive message store: ", BottleId, messageStore);

  $: if ($dialogBottle === BottleId) {
    console.log("Reactive dialogBottle", BottleId, $dialogBottle);
  }

  async function onSubmissionSuccess(deleteBottle?: string) {
    console.log(
      "onSubmissionSuccess triggered",
      BottleId,
      deleteBottle,
      $dialogBottle
    );
    await preloadData("/bottles").then((result) => {
      if (result.type === "loaded" && result.status === 200) {
        if (deleteBottle) {
          bottles2 = [...bottles].filter(
            (bottle) => bottle.id !== deleteBottle
          );
          bottles = bottles2;
          let temp: BottleRecordsSchema = $page.data.bottlesDB;
          temp.splice(Number(currIndex), 1);
        }
        replaceState("/table", { bottlePreLoad: result.data });
        replaceState("/bottles/[[]]", { bottlePreLoad: result.data });
        replaceState("/bottles", { bottlePreLoad: result.data });

        history.back();

        if (result.data.bottlesDB) bottles = result.data.bottlesDB;

        messageStore = "Listening";
        editBottleDialog2 = false;
        if (deleteBottle) {
          bottles2 = [...bottles].filter(
            (bottle) => bottle.id !== deleteBottle
          );
          bottles = bottles2;

          result.data.bottlesDB = bottles2;
          replaceState("/table", { bottlePreLoad: result.data });
          replaceState("/bottles/[[]]", { bottlePreLoad: result.data });
          replaceState("/bottles", { bottlePreLoad: result.data });
        }
      }
    });
  }

  async function onBottleEditClick(
    e: MouseEvent & { currentTarget: HTMLElement }
  ): Promise<void> {
    // Cast the current target to a type that may have an href
    let target = e?.currentTarget as HTMLAnchorElement;
    // prevent full navigation
    e.preventDefault();

    let href = target?.href || `/bottles/${BottleId}`;

    // run `load` functions (or rather, get the result of the `load` functions
    // that are already running because of `data-sveltekit-preload-data`)
    await preloadData(href)
      .then((result) => {
        if (result.type === "loaded" && result.status === 200) {
          pushState(href, { bottlePreLoad: result.data });

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
        } else {
          console.log("🚀 ~ failed to onclick condition", result);

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
  }

  $: if (BottleId && $page.state.bottlePreLoad?.form?.data?.id === BottleId) {
    console.log(
      "🚀 ~ file: +page.svelte:214 ReactiveIf - state ~ ($page, editBottleInit, editBottleDialog2:",
      $page,
      editBottleInit,
      editBottleDialog2
    );

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
  } else {
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
    let origSK: DataTablePlugins.SortKey[];
    // getContext<DataTablePlugins.WritableSortKeys>("sortKeys").update((sk) => {
    //   origSK = sk;
    //   return [...sk, { id: "BottleId", order: "asc" }];
    // });
    editBottleDialog2 = false;
    console.log("🚀 ~ file: +page.svelte:257 ~ messageStore:", messageStore);
    messageStore = "Listening";
    const tmpPrepBottles = prepTableData([bottles[Number(currIndex)]]);
    updateData(currIndex, tmpPrepBottles[0]);
    // onSubmissionSuccess();
    // history.back();
    messageStore = "Listening";

    console.log(
      "Testing history.back() - Before, 1.messageStore, 2.editBottleDialog2+init, 3.currIndex, 4.$dialogBottle, 5.BottleId, 6.$page, 7.bottles, 8.$dataStore---",
      messageStore,
      editBottleDialog2,
      editBottleInit,
      currIndex,
      $dialogBottle,
      BottleId,
      $page,
      bottles,
      $dataStore
    );
    history.back();
    editBottleDialog2 = false;
    console.log(
      "Testing history.back() - After, 1.messageStore, 2.editBottleDialog2+init, 3.currIndex, 4.$dialogBottle, 5.BottleId, 6.$page, 7.bottles, 8.$dataStore---",
      messageStore,
      editBottleDialog2,
      editBottleInit,
      currIndex,
      $dialogBottle,
      BottleId,
      $page,
      bottles,
      $dataStore
    );
    // getContext<DataTablePlugins.WritableSortKeys>("sortKeys").update(
    //   () => origSK
    // );
  } else if (
    $dialogBottle === BottleId &&
    messageStore !== "Listening" &&
    currIndex !== "-1"
  ) {
    let origSK: DataTablePlugins.SortKey[];
    // getContext<DataTablePlugins.WritableSortKeys>("sortKeys").update((sk) => {
    //   origSK = sk;
    //   return [...sk, { id: "BottleId", order: "asc" }];
    // });
    editBottleDialog2 = false;
    console.log("🚀 ~ file: +page.svelte:257 ~ messageStore:", messageStore);
    messageStore = "Listening";
    updateData(currIndex, null);
    // onSubmissionSuccess(currIndex);
    // history.back();
    bottles2 = [...bottles].filter((bottle) => bottle.id !== messageStore);
    let temp: BottleRecordsSchema = $page.data.bottlesDB;
    temp.splice(Number(currIndex), 1);
    messageStore = "Listening";
    console.log(
      "Testing history.back() - Before, messageStore, editBottleDialog2+init, currIndex, $dialogBottle, BottleId, $page, bottles, $dataStore---",
      messageStore,
      editBottleDialog2,
      editBottleInit,
      currIndex,
      $dialogBottle,
      BottleId,
      $page,
      bottles,
      $dataStore
    );
    history.back();
    editBottleDialog2 = false;
    console.log(
      "Testing history.back() - After, messageStore, editBottleDialog2+init, currIndex, $dialogBottle, BottleId, $page, bottles, $dataStore---",
      messageStore,
      editBottleDialog2,
      editBottleInit,
      currIndex,
      $dialogBottle,
      BottleId,
      $page,
      bottles,
      $dataStore
    );
    // getContext<DataTablePlugins.WritableSortKeys>("sortKeys").update(
    //   () => origSK
    // );
  }
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
    <!-- <DropdownMenu.Item>View payment details</DropdownMenu.Item> -->
  </DropdownMenu.Content>
</DropdownMenu.Root>

<div class="grid grid-cols-2 w-full gap-7">
  <Dialog.Root
    open={editBottleDialog2}
    preventScroll={false}
    onOpenChange={async (open) => {
      console.log("start of onOpenChange", open, $dialogBottle, BottleId);
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
