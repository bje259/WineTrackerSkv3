<script lang="ts">
  import { AppBar, AppShell, SlideToggle } from "@skeletonlabs/skeleton";
  import "../app.postcss";
  // Highlight JS
  import "highlight.js/styles/github-dark.css";
  // for HTML
  // Floating UI for Popups
  import * as Command from "$lib/components/ui/command";
  import type { User } from "$lib/types";
  import { onMount } from "svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { storePopup } from "@skeletonlabs/skeleton";
  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
  } from "@floating-ui/dom";
  import { Button } from "$lib/components/ui/button";
  import * as Sheet from "$lib/components/ui/sheet";
  import type { PageData } from "./$types";
  //import type {LayoutData} from "./$types";
  //export let data: LayoutData;
  export let data: PageData;
  //shallowrouting imports
  import { preloadData, pushState, goto } from "$app/navigation";
  import * as Dialog from "$lib/components/ui/dialog";
  import LoginPage from "./login/+page.svelte";
  import { page } from "$app/stores";
  import type { NavigationEvent } from "@sveltejs/kit";
  import { beforeNavigate } from "$app/navigation";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";

  const combinedData = { ...data, ...$page.state.loginPageData! };

  let devMenuOpen = false;

  function onNav() {
    if (devMenuOpen) {
      devMenuOpen = false;
    }
  }

  beforeNavigate(onNav);

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        devMenuOpen = !devMenuOpen;
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  async function onLoginLinkClick(
    e: MouseEvent & { currentTarget: HTMLAnchorElement }
  ) {
    // bail if opening a new tab
    if (e.metaKey || e.ctrlKey) return;
    // prevent full navigation
    e.preventDefault();

    const { href } = e.currentTarget;

    // run `load` functions (or rather, get the result of the `load` functions
    // that are already running because of `data-sveltekit-preload-data`)
    const result = await preloadData(href);

    if (result.type === "loaded" && result.status === 200) {
      pushState(href, { loginPageData: result.data });
    } else {
      // something bad happened! try navigating
      goto(href);
    }
  }

  const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

  const debug = writable<boolean>(false);
  const user = writable<User>(data.user);
  setContext("debug", debug);
  setContext("user", user);

  let loginDialogOpen = false;
  $: if ($page.state.loginPageData) {
    loginDialogOpen = true;
  } else {
    loginDialogOpen = false;
  }

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  let x: string;
  let y: string | undefined;
  $: {
    x = data?.user?.username;
    y = data?.user?.id;
  }
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 p-4">
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <strong class="text-xl uppercase">Skeleton</strong>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if !x}
          <a
            href="/login"
            class="btn variant-glass-primary text-primary-900-50-token h-8 rounded-md font-medium px-4 py-2 hover:bg-primary-50-900-token"
            on:click={onLoginLinkClick}>Login</a
          >{:else if x}
          <div class="flex flex-shrink space-x-4">
            <p class="self-center">
              Welcome, {x}!
            </p>
            <a
              href="/logout"
              class="btn variant-glass-primary text-primary-900-50-token h-8 rounded-md font-medium px-4 py-2 hover:bg-primary-50-900-token"
              >Logout</a
            >
          </div>
        {/if}
        <!-- <Button
          href="/login"
          on:click={onLoginLinkClick}
          class="variant-soft-primary text-primary-900-50-token h-6"
          >Login</Button
        > -->
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <!-- <svelte:fragment slot="sidebarLeft">
   
    <nav class="list-nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/bottles">Bottle Management</a></li>
        <li><a href="/sandbox">Sandbox</a></li>
        {#if !x}
          <li>
            <a href="/login" on:click={onLoginLinkClick}>Test Login</a>
          </li>
        {:else if x}
          <li><a href="/logout">Log Out</a></li>
          <li>
            Currently logged in as <br />
            {x}<br /> (userID {y})
          </li>
        {/if}
      </ul>
    </nav>
  </svelte:fragment> -->

  <Sheet.Root bind:open={devMenuOpen}>
    <!-- <Sheet.Trigger asChild let:builder>
        <Button builders={[builder]} class="variant-glass-primary">Open</Button>
      </Sheet.Trigger> -->
    <Sheet.Content side={"left"}>
      <Sheet.Header>
        <Sheet.Title>Dev Menu</Sheet.Title>
        <Sheet.Description></Sheet.Description>
      </Sheet.Header>
      <!-- Insert the list: -->
      <nav class="list-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/bottles">Bottle Management</a></li>
          <li><a href="/export">Export Bottles</a></li>
          <li><a href="/import">Import Bottles</a></li>
          <li><a href="/sandbox">Sandbox</a></li>
          <li><a href="/table">Table</a></li>
          <li><a href="/logs">Logs</a></li>
          {#if !x}
            <li>
              <a href="/login" on:click={onLoginLinkClick}>Test Login</a>
            </li>
          {:else if x}
            <li><a href="/logout">Log Out</a></li>
            <li>
              Currently logged in as <br />
              {x}<br /> (userID {y})
            </li>
          {/if}
          <li>
            <div class="flex flex-none">
              <SlideToggle
                name="debug slider"
                active="bg-secondary-500"
                size="md"
                bind:checked={$debug}>Debug Mode</SlideToggle
              >
              <!-- <Switch
                bind:checked={data.debug}
              />
            </div> -->
            </div>
          </li>
        </ul>
      </nav>
    </Sheet.Content>
  </Sheet.Root>

  <!-- --- -->

  <!-- Page Route Content -->
  <div class="flex flex-row flex-shrink-0">
    <Button
      type="button"
      class="h-auto variant-ghost"
      on:click={() => (devMenuOpen = !devMenuOpen)}
      ><p class="text-4xl">→</p></Button
    >
    <slot />
  </div>
</AppShell>
<Dialog.Root
  open={loginDialogOpen}
  onOpenChange={(open) => {
    if (!open) {
      history.back();
    }
  }}
>
  <Dialog.Content>
    <LoginPage data={combinedData} />
  </Dialog.Content>
</Dialog.Root>
