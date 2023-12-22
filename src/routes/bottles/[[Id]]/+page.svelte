<script lang="ts">
  import EditBottle from "$lib/EditBottle.svelte";
  import { getContext } from "svelte";
  //import EditBottle from '$lib/EditBottle.svelte';
  //import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from "./$types";
  import type { Writable } from "svelte/store";
  //import TestForm from './TestForm3.svelte';
  import type { User } from "$lib/types";

  export let data: PageData;
  const user: Writable<User> = getContext("user");
</script>

<!-- form Code starts here-->

<EditBottle data={data.form} bottles={data.bottlesDB} currentUser={user} />

<!-- form Code ends here-->
