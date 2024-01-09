<script lang="ts">
  import type { PageData } from "./$types";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type {
    User,
    BottleRecordTableSchema,
    BottleRecordsTableSchema,
  } from "$lib/types";
  import * as Table from "$lib/components/ui/table";
  import { bottleRecordSchema, bottleRecordTableSchema } from "$lib/Schemas";
  type BottleRecordTableSchema = z.infer<typeof bottleRecordTableSchema>;
  import { z } from "zod";

  import {
    addPagination,
    addSortBy,
    addTableFilter,
    addGridLayout,
    addHiddenColumns,
    addSelectedRows,
  } from "svelte-headless-table/plugins";
  import customCell from "./customCell.svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
    HeaderRow,
    BodyRow,
  } from "svelte-headless-table";
  import { readable, type Readable } from "svelte/store";
  import DataTableActions from "./data-table-actions.svelte";
  import {
    ArrowDownZA,
    ArrowUpAZ,
    ArrowUpDown,
    ChevronDown,
  } from "lucide-svelte";
  import type * as DataTablePlugins from "svelte-headless-table/plugins";
  import { Input } from "$lib/components/ui/input";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import DataTableCheckbox from "./data-table-checkbox.svelte";
  export let data: BottleRecordsTableSchema;
  export let dataStore: Writable<BottleRecordsTableSchema>;

  const user: Writable<User> = getContext("user");
  const debug: Writable<boolean> = getContext("debug");

  const dialogBottle = writable<string>("");

  const updateData = (
    rowDataId: string,
    newValue: BottleRecordTableSchema | null
  ) => {
    const idx = parseInt(rowDataId);
    dataStore.update((data) => {
      if (newValue === null) {
        data.splice(idx, 1);
      } else {
        data[idx] = { ...data[idx], ...newValue };
      }
      return data; // Ensure to return the updated data
    });
    console.log(
      "Update datastore:newValue,idx,dataStore",
      newValue,
      idx,
      newValue?.BottleId ? pullBottleData(newValue.BottleId as string) : null
    );
  };

  function pullBottleData(bottleId: string) {
    const bottle = $dataStore.find((bottle) => bottle.BottleId === bottleId);
    return bottle;
  }

  let table = createTable(dataStore, {
    page: addPagination(),
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
    hide: addHiddenColumns(),
    select: addSelectedRows(),
  });

  function formatDateToMMDDYYYY(dateString: string) {
    const date = new Date(dateString);
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  let editBottleDialog: Writable<boolean>;
  $: if (getContext("editBottleDialog")) {
    editBottleDialog = getContext("editBottleDialog");
  }

  const columns = table.createColumns([
    table.display({
      id: "id",
      header: (_, { pluginStates }) => {
        const { allRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allRowsSelected,
        });
      },
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);
        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: "BottleId",
      header: "BottleId",
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "Name",
      header: "Name",
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "Producer",
      header: "Producer",
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "Vintage",
      header: "Vintage",
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "Purchased",
      header: "Purchased",
      cell: ({ value }) => {
        const formattedDate = value
          ? formatDateToMMDDYYYY(value.toString())
          : "";
        return formattedDate;
      },
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "Consumed",
      header: "Consumed",
      cell: ({ value }) => {
        const formattedDate = value
          ? formatDateToMMDDYYYY(value.toString())
          : "";
        return formattedDate;
      },
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "created",
      header: "Create Date",
      cell: ({ value }) => {
        const formattedDate = value
          ? formatDateToMMDDYYYY(value.toString())
          : "";
        return formattedDate;
      },
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: "updated",
      header: "Update Date",
      cell: ({ value }) => {
        const formattedDate = value
          ? formatDateToMMDDYYYY(value.toString())
          : "";
        return formattedDate;
      },
      plugins: {
        sort: {
          disable: false,
        },
        filter: {
          exclude: false,
        },
      },
    }),
    table.column({
      accessor: ({ BottleId }) => BottleId,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, {
          BottleId: value as string,
          dialogBottle,
          dataStore,
          updateData,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
  ]);

  let {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
    tableHeadAttrs,
    flatColumns,
    rows,
  } = table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { sortKeys } = pluginStates.sort;
  const { filterValue } = pluginStates.filter;
  const { hiddenColumnIds } = pluginStates.hide;
  const { selectedDataIds, getRowState } = pluginStates.select;

  const hidableCols: {
    [key: string]: boolean | null;
  } = {
    id: null,
    BottleId: true,
    Name: null,
    Producer: true,
    Vintage: true,
    Purchased: true,
    Consumed: false,
    created: false,
    updated: false,
    "": null,
  };

  const ids = flatColumns.map((col) => col.id);
  let hideForId = Object.fromEntries(ids.map((id) => [id, hidableCols[id]]));
  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => !hide && hide !== null)
    .map(([id]) => id);

  $: console.log(
    "checks line 222",
    $tableAttrs,
    $tableBodyAttrs,
    $tableHeadAttrs,
    pluginStates
  );

  // $: console.log("Reactive datastore values:", $dataStore);
  $: {
    if (!$dialogBottle) console.log("Reactive datastore values:", $dataStore);
    else
      console.log(
        "Reactive datastore values filtered:",
        $dataStore.find((bottle) => bottle.BottleId === $dialogBottle)
      );
  }
  // spacer
</script>

<!-- <pre>$sortKeys = {JSON.stringify($sortKeys, null, 2)}</pre> -->
{#if $debug}<SuperDebug
    data={{
      $hiddenColumnIds,
      $sortKeys,
      $filterValue,
      $tableAttrs,
      $tableBodyAttrs,
      $tableHeadAttrs,
      $selectedDataIds,
      $editBottleDialog,
    }}
    collapsible
  />{/if}

<div>
  <div class="flex items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Search bottles"
      type="text"
      bind:value={$filterValue}
    />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" class="ml-auto" builders={[builder]}>
          Columns <ChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {#each flatColumns as col}
          {#if hidableCols[col.id] !== null}
            <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
              {col.header}
            </DropdownMenu.CheckboxItem>
          {/if}
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header {...$tableHeadAttrs} class="[&:has([role=checkbox])]:pl-3">
        {#each $headerRows as headerRow (headerRow.id)}
          <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props
                >
                  <Table.Head {...attrs}>
                    {#if $sortKeys.find((v) => v.id === cell.id)}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        {#if $sortKeys.find((v) => v.id === cell.id && v.order === "asc")}
                          <ArrowUpAZ class={"ml-2"} size={20} strokeWidth={1} />
                        {:else if $sortKeys.find((v) => v.id === cell.id && v.order === "desc")}
                          <ArrowDownZA
                            class={"ml-2"}
                            size={20}
                            strokeWidth={1}
                          />
                        {:else}
                          <ArrowUpDown
                            class={"ml-2"}
                            size={20}
                            strokeWidth={1}
                          />
                        {/if}
                      </Button>
                    {:else if cell.id !== "" && cell.id !== "id"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <ArrowUpDown class={"ml-2"} size={20} strokeWidth={1} />
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>

      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row
              {...rowAttrs}
              data-state={$selectedDataIds[row.id] && "selected"}
            >
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
                    {#if cell.id === "id"}
                      <Render
                        of={createRender(DataTableCheckbox, {
                          checked: getRowState(row).isSelected,
                        })}
                      />
                    {:else if cell.id === ""}
                      <Render of={cell.render()} />
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                    <!-- <Render
                      of={createRender(customCell, {
                        value: dataStore,
                        row,
                        cell,
                      })}
                    /> -->
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {Object.keys($selectedDataIds).length} of{" "}
      {$rows.length} row(s) selected.
    </div>
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
    >
  </div>
  <p>*Hold shift to sort by multiple columns*</p>
</div>

<style>
</style>
