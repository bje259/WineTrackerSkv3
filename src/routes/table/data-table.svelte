<script lang="ts">
  import type { PageData } from "./$types";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import type { User } from "$lib/types";
  export let data: BottleRecords;
  import * as Table from "$lib/components/ui/table";
  import { bottleRecordSchema } from "$lib/Schemas";
  import { z } from "zod";
  import {
    addPagination,
    addSortBy,
    addTableFilter,
    addGridLayout,
  } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import DataTableActions from "./data-table-actions.svelte";
  import { ArrowDownZA, ArrowUpAZ, ArrowUpDown } from "lucide-svelte";
  import type * as DataTablePlugins from "svelte-headless-table/plugins";
  import { Input } from "$lib/components/ui/input";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  type BottleRecord = z.infer<typeof bottleRecordSchema>;
  type BottleRecords = BottleRecord[];
  const user: Writable<User> = getContext("user");
  const debug: Writable<boolean> = getContext("debug");

  const table = createTable(readable(data), {
    page: addPagination(),
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
    grid: addGridLayout(),
  });

  function formatDateToMMDDYYYY(dateString: string) {
    const date = new Date(dateString);
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  const columns = table.createColumns([
    table.column({
      accessor: "id",
      header: "ID",
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
        const formattedDate = value ? formatDateToMMDDYYYY(value) : "";
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
        const formattedDate = value ? formatDateToMMDDYYYY(value) : "";
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
        const formattedDate = value ? formatDateToMMDDYYYY(value) : "";
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
        const formattedDate = value ? formatDateToMMDDYYYY(value) : "";
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
      accessor: ({ id }: { id: string }) => id,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, { id: value });
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

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
    tableHeadAttrs,
  } = table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { sortKeys } = pluginStates.sort;
  const { filterValue } = pluginStates.filter;

  // spacer
</script>

<!-- <pre>$sortKeys = {JSON.stringify($sortKeys, null, 2)}</pre> -->
{#if $debug}<SuperDebug
    data={{ $sortKeys, $filterValue, $tableAttrs, $tableBodyAttrs }}
  />{/if}

<div>
  <div class="flex items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter bottle names"
      type="text"
      bind:value={$filterValue}
    />
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header {...$tableHeadAttrs}>
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
                    {:else if cell.id !== ""}
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
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
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
