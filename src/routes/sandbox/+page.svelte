<script lang="ts">
  import Calendarform from "./calendarform.svelte";
  import Comboboxform from "./comboboxform.svelte";

  // export let data: PageData;
</script>

<div class="flex flex-col w-3/4">
  <input class="input" title="Input (month)" type="month" />
  <br />
  <!-- <Datepickerform /> -->
  <br />
  <Calendarform />
  <br />
  <Comboboxform />
</div>
