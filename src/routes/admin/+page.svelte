<script lang="ts">
  import type { PageData } from "./$types";
  import { adminToolsSchema } from "$lib/Schemas";
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import { getForm } from "formsnap";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import { PUBLIC_PB_HOST } from "$env/static/public";
  import PocketBase from "pocketbase";
  import pb from "$lib/browserclient";
  import { browser } from "$app/environment";
  import { invalidate, invalidateAll } from "$app/navigation";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  export let data: PageData;
  const debug: Writable<boolean> = getContext("debug");
  import { superForm, type SuperForm } from "sveltekit-superforms/client";
  import { Button } from "$components/ui/button";
  import { nodes } from "$lib/treedefinition";
  import {
    TreeView,
    TreeViewItem,
    RecursiveTreeView,
    type TreeViewNode,
  } from "@skeletonlabs/skeleton";
  let myTreeView: RecursiveTreeView;
  let expandedNodes: string[] = [];
  const superFrm = superForm(data.form, { validators: adminToolsSchema });
  let singleCheckedNodes: string[] = [];
  const { admin, user, form } = data;
  let theFormStore: Writable<any> = superFrm.form;
  let debugCollapsed: boolean = false;
  let result: any = null;
  let treeItems: TreeViewItem[] = [];
  $: {
    try {
      if ($theFormStore?.result) result = JSON.parse($theFormStore.result);
    } catch (error) {
      console.log("Error parsing query results", error);
    }
  }

  function toggleNode(nodeId: string) {
    const index = expandedNodes.indexOf(nodeId);
    if (index === -1) {
      expandedNodes.push(nodeId);
    } else {
      expandedNodes.splice(index, 1);
    }
    // This line is necessary to trigger Svelte's reactivity system
    expandedNodes = [...expandedNodes];
  }

  function toggleTree(node: TreeViewNode, open?: boolean) {
    if (node?.id && exclude.indexOf(node.id) === -1) {
      // if (node.content) console.log("toggling", node.content);
      //option a
      // if (
      //   ((open ?? true) && !(expandedNodes.indexOf(node.id) != -1)) ||
      //   (!(open ?? false) && expandedNodes.indexOf(node.id) != -1)
      // )
      //   toggleNode(node.id);

      //option b
      if (
        open === undefined
          ? true
          : (open ? 1 : 0) ^ (expandedNodes.indexOf(node.id) != -1 ? 1 : 0)
      )
        toggleNode(node.id);

      if (node?.children)
        node.children.forEach((node: TreeViewNode) => {
          // console.log(node.id);
          toggleTree(node, open);
        });
    }
  }

  let exclude = ["crud", "Realtime handlers"];

  toggleTree(nodes[0], true);
</script>

<div class="flex flex-col space-y-3 p-6 justify-center flex-auto ml-auto">
  <div>
    <h1 class="text-center">Admin Tool Box</h1>
  </div>
  <div class="self-center">
    <Button on:click={() => (debugCollapsed = !debugCollapsed)}
      >Toggle Debug</Button
    >
    <Button
      on:click={() => {
        toggleTree(nodes[0], true);
      }}>Expand Tree</Button
    >
    <Button
      on:click={() => {
        toggleTree(nodes[0], false);
      }}>Collapse Tree</Button
    >
    <Button
      on:click={() => {
        toggleTree(nodes[0]);
      }}>Toggle Tree</Button
    >
  </div>
  <div>
    <RecursiveTreeView
      selection
      {nodes}
      bind:checkedNodes={singleCheckedNodes}
      bind:this={myTreeView}
      bind:expandedNodes
      bind:treeItems
      on:toggle={(e) => {
        console.log("Expanded Nodes", expandedNodes);
        // console.log("this", myTreeView);
        // console.log("expandedNodes", expandedNodes);
        // console.log("treeItems", treeItems);
        // console.log("nodes", nodes);
        // console.log("checkedNodes", singleCheckedNodes);
        // console.log("myTreeView", myTreeView);
      }}
    />
  </div>

  <Form.Root
    form={superFrm}
    controlled
    schema={adminToolsSchema}
    let:config
    debug={false}
    class="p-4 space-y-3 rounded-lg shadow-lg"
  >
    <input type="hidden" name="result" />
    <Form.Item>
      <Form.Field {config} name="input1">
        <Form.Label>input1</Form.Label>
        <Form.Input />

        <Form.Validation />
      </Form.Field>
      <Form.Field {config} name="input2">
        <Form.Label>input2</Form.Label>
        <Form.Input />

        <Form.Validation />
      </Form.Field>
      <Form.Button>Submit</Form.Button>
    </Form.Item>
  </Form.Root>

  <SuperDebug
    data={{
      // myTreeView,
      result,
      $theFormStore,
      singleCheckedNodes,
      treeItems,
      expandedNodes,
      nodes,
    }}
    collapsible
    bind:collapsed={debugCollapsed}
  />
</div>
