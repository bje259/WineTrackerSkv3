<script lang="ts">
  import { AppBar, AppShell } from "@skeletonlabs/skeleton";
  import "../app.postcss";
  // Highlight JS
  import "highlight.js/styles/github-dark.css";
  // for HTML
  // Floating UI for Popups
  import { storePopup } from "@skeletonlabs/skeleton";
  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
  } from "@floating-ui/dom";
  import type { PageData } from "./$types";
  //import type {LayoutData} from "./$types";
  //export let data: LayoutData;
  export let data: PageData;
  //shallowrouting imports
  import { preloadData, pushState, goto } from "$app/navigation";
  import * as Dialog from "$lib/components/ui/dialog";
  import LoginPage from "./login/+page.svelte";
  import { page } from "$app/stores";

  const combinedData = { ...data, ...$page.state.loginPageData };

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

  let loginDialogOpen = false;
  $: if ($page.state.loginPageData) {
    loginDialogOpen = true;
  } else {
    loginDialogOpen = false;
  }

  // const ob1 = ({loginPage}={$page.state});
  // const obj2 = {data?.user};
  // const combined = {...obj1, ...obj2};
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  $: x = data?.user?.username?.toString();
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 p-4">
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <strong class="text-xl uppercase">Skeleton</strong>
      </svelte:fragment>
      <svelte:fragment slot="trail"></svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <!-- Insert the list: -->
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
            {x}<br /> (userID {data?.user?.Id})
          </li>
        {/if}
      </ul>
    </nav>
    <!-- --- -->
  </svelte:fragment>

  <!-- Page Route Content -->
  <slot />
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
