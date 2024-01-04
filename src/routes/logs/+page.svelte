<script lang="ts">
  import type { PageData } from "./$types";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  export let data: PageData;

  $: logs = data.logs;
</script>

<h1>Logs</h1>
<SuperDebug data={logs} />
<pre>
  <code class="language-json">{JSON.stringify(logs, null, 2)}</code>
</pre>

```
