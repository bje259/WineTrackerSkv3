<script lang="ts">
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	// Highlight JS
	import 'highlight.js/styles/github-dark.css';
	// for HTML
	// Floating UI for Popups
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
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
			</ul>
		</nav>
		<!-- --- -->
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
