<script lang="ts">
  import { goto, invalidateAll, preloadData, pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import { crudSchema } from "$lib";
  import EditBottle from "$lib/EditBottle.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  import type { User } from "$lib";

  import { MoreHorizontal } from "lucide-svelte";

  import { getContext, onMount, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { superForm, type SuperForm } from "sveltekit-superforms/client";
  import { z } from "zod";

  export let BottleId: string;
  const user: Writable<User> = getContext("user");
  let openDDL = writable<boolean>(false);
  let editBottleDialog2 = writable<boolean>(false);
  setContext("editBottleDialog2", editBottleDialog2);
  let editBottleInit = writable<boolean>(true);
  let theForm2: Writable<z.infer<typeof crudSchema>>, message2, errors2;
  let formData2: SuperForm<typeof crudSchema>;

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
    e: MouseEvent & { currentTarget: HTMLElement },
    hrefParam: string
  ): Promise<void> {
    console.log("🚀 ~ file: data-table-actions.svelte:29 ~ currentTarget:", e);
    // Cast the current target to a type that may have an href
    let target = e?.currentTarget as HTMLAnchorElement;
    // prevent full navigation
    e.preventDefault();

    let href = target?.href || hrefParam;
    console.log("🚀 ~ file: +page.svelte:60 ~ onClickFunction- href:", href);
    // run `load` functions (or rather, get the result of the `load` functions
    // that are already running because of `data-sveltekit-preload-data`)
    preloadData(href)
      .then((result) => {
        console.log(
          "🚀 ~ file: +page.svelte:64 ~ onClickFunction ~ result",
          result
        );
        if (result.type === "loaded" && result.status === 200) {
          pushState(href, { bottlePreLoad: result.data });
          console.log(
            "🚀 ~ file: +page.svelte:69 ~ onClickFunction - (loaded=true) Setting init=true result.data:",
            result.data
          );
          if ($page.state.bottlePreLoad?.form?.data?.id) {
            $editBottleDialog2 = true;
            $editBottleInit = false;
          }
          // $editBottleDialog2 = true;
        } else {
          //goto(href);
          console.log("🚀 ~ failed to onclick condition", result);
          $editBottleDialog2 = false;
          $editBottleInit = true;
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during preloadData or in the then block
        console.error(error);
      });
    //console.log("🚀 ~ file: +page.svelte:73 ~ href:", href);
  }

  $: if ($page.state.bottlePreLoad?.form.data.id) {
    console.log(
      "🚀 ~ file: +page.svelte:84 ReactiveIf - state ~ ($page:",
      $page,
      $editBottleDialog2,
      $editBottleInit
    );
    console.log(
      "Line 88: ReactiveIf - state - Current boolean is",
      $editBottleDialog2
    );
    console.log("pagestate form", $page.state.bottlePreLoad.form);
    formData2 = superForm($page.state.bottlePreLoad.form, {
      validators: crudSchema,
      resetForm: true,
      warnings: {
        duplicateId: false,
      },
    }) as SuperForm<typeof crudSchema>;

    ({ form: theForm2, message: message2, errors: errors2 } = formData2);
    console.log(
      "🚀 ~ file: +page.svelte:97 ~ ReactiveIf - state - form: theForm2, message: message2, errors: errors2 } = formData2): and bottles",
      $theForm2,
      $message2,
      $errors2,
      formData2,
      $page.state
    );

    if ($editBottleInit) {
      $editBottleDialog2 = true;
      $editBottleInit = false;
    }
  } else {
    // if ($editBottleInit) {
    //   $editBottleDialog2 = false;
    //   $editBottleInit = true;
    //   history.back();
    // }
  }
</script>

<DropdownMenu.Root bind:open={$openDDL}>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative w-8 h-8 p-0"
      on:mouseenter={async (e) =>
        await onBottleEditClick(e, `/bottles/${BottleId}`)}
    >
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
          await onBottleEditClick(e, hrefString);
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
    open={$editBottleDialog2}
    onOpenChange={(open) => {
      if (!open) {
        $editBottleDialog2 = false;
        console.log(
          "🚀 ~ file: +page.svelte:180 onOpenChange ~ not open $page:",
          $page
        );
        // invalidateAll();
        history.back();
      }
    }}
  >
    <Dialog.Trigger let:builder asChild>
      <Button
        builders={[builder]}
        href="/bottles"
        on:click={async (e) => {
          e.preventDefault();
          const hrefString = `/bottles/${BottleId}`;
          await onBottleEditClick(e, hrefString);
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
