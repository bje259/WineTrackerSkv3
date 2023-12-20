<script lang="ts">
	import EditBottle from '$lib/EditBottle.svelte';
	//import EditBottle from '$lib/EditBottle.svelte';
	//import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	//import TestForm from './TestForm3.svelte';

	export let data: PageData;
</script>

<!-- form Code starts here-->

<EditBottle data={data.form} bottles={data.bottles} />

<!-- form Code ends here-->
