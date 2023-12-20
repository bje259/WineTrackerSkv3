<script>
import { derived, writable } from "svelte/store";
import { ITEM_SELECTOR, VALUE_ATTR, getCtx, getState } from "../../node_modules/cmdk-sv/dist/cmdk/command.js";
import { addEventListener, isBrowser, isHTMLInputElement } from "$utils/cmdk/internal/index.js";
import { sleep } from "$utils/cmdk/internal/helpers/sleep.js";
const { ids, commandEl } = getCtx();
const state = getState();
const search = derived(state, ($state) => $state.search);
const valueStore = derived(state, ($state) => $state.value);
export let autofocus = void 0;
export let value = $search;
export let asChild = false;
export let el = void 0;
import { cn } from "$lib/utils";
import { Search } from "lucide-svelte";
let className = undefined;
export { className as class };
export let stateStore = new writable();
export let handleUpdateState;
export let filterFn = customYearFilter;



const selectedItemId = derived([valueStore, commandEl], ([$value, $commandEl]) => {
  if (!isBrowser)
    return void 0;
  const item = $commandEl?.querySelector(`${ITEM_SELECTOR}[${VALUE_ATTR}="${$value}"]`);
  return item?.getAttribute("id");
});

function handleValueUpdate(v) {
	
	customUpdateState("search", v);
}

function action(node) {
  if (autofocus) {
    sleep(10).then(() => node.focus());
  }

  const unsubEvents = addEventListener(node, "change", (e) => {
    if (!isHTMLInputElement(e.target))
      return;
    state.updateState("search", e.target.value);
  });
  return {
    destroy: unsubEvents
  };
}
$: handleValueUpdate(value);


  let attrs;
$: attrs = {
    type: "text",
    "data-cmdk-input": "",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    "aria-autocomplete": "list",
    role: "combobox",
    "aria-expanded": true,
    "aria-controls": ids.list,
    "aria-labelledby": ids.label,
    "aria-activedescendant": $selectedItemId ?? void 0,
    id: ids.input
  };



function normalizeScore(score, maxPossibleScore) {
    let normScore = score / maxPossibleScore;
    if (normScore > 0.01) {
      return normScore;
    } else {
      return 0;
    }
  }

  function customYearFilter(yearIn, query) {
    let queryNum = Number(query);
    let score = 0;
    let year = Number(yearIn);
    // Exact match
    if (query === year.toString()) {
      score += 100;
    }
    // Partial match
    else if (year.toString().startsWith(query)) {
      score += 50 * (query.length / year.toString().length);
    }
    // Recency bias
    score += 10 / Math.max(Math.abs(year - queryNum), 1);

    // Assuming a maximum possible score (adjust based on your scoring logic)
    const maxPossibleScore = 100 + 50 + 10; // Example: max score for exact match and recent year
    return Math.min(normalizeScore(score, maxPossibleScore), 1);
  }




 
//   type $$Props = CommandPrimitive.CommandProps & {
//     handleUpdateState: typeof handleUpdateState;
// 	filterFn: typeof filterFn;
//   };

//   $: handleUpdateState({ value });


  function customFilterItems($state, shouldFilter) {
	if (!stateStore) return $state;
	const { items, search } = $state;
	const filteredItems = items.filter((item) => {
	  const score = filterFn(item.value, search);
	  return score > 0;
	});
	return { ...state, items: filteredItems };
  }

  function customSort(state, shouldFilter) {
	if (!shouldFilter) return state;
	const { items, search } = state;
	const sortedItems = items.sort((a, b) => {
	  const aScore = filterFn(a.value, search);
	  const bScore = filterFn(b.value, search);
	  return bScore - aScore;
	});
	return { ...state, items: sortedItems };
  }

  function selectFirstItem() {
	const { items } = state;
	if (items.length === 0) return;
	const firstItem = items[0];
	return firstItem.value;
  }

//   function scrollSelectedIntoView() {
// 	const { value } = state;
// 	const item = commandEl.get()?.querySelector(`${ITEM_SELECTOR}[${VALUE_ATTR}="${value}"]`);
// 	if (!item) return;
// 	item.scrollIntoView({ block: "nearest" });
//   }



function customUpdateState(key, value) {
    
    state.update((curr) => {
      if (Object.is(curr[key], value)) return curr;
      curr[key] = value;
      if (key === "search") {
        const filteredState = customFilterItems(curr, true);
        curr = filteredState;
        const sortedState = customSort(curr, true);
        curr = sortedState;
        tick().then(() =>
          state.update((curr) => {
            curr.value = selectFirstItem() ?? "";
            return curr;
          })
        );
      } 
	//   else if (key === "value") {
    //     state.onValueChange?.(curr.value);
    //     if (!preventScroll) {
    //       tick().then(() => scrollSelectedIntoView());
    //     }
    //   }
      return curr;
    });
  }

</script>



<div class="flex items-center border-b px-2" data-cmdk-input-wrapper="">
<Search class={cn(
      "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className
    )} />
{#if asChild}
	<slot {action} {attrs} />
{:else}
	<input
		bind:this={el}
		{...attrs}
		bind:value
		use:action
		{...$$restProps}
		on:input
		on:focus
		on:blur
		on:change
	/>
{/if}
</div>
 

  
  <!-- <CommandPrimitive.Input
    class={cn(
      "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...$$restProps}
    bind:value
  /> -->

  







