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
  // import pb from "$lib/browserclient";
  import { browser } from "$app/environment";
  import { invalidate, invalidateAll } from "$app/navigation";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  export let data: PageData;
  const debug: Writable<boolean> = getContext("debug");
  import { superForm, type SuperForm } from "sveltekit-superforms/client";
  import { Button } from "$components/ui/button";
  import { nodesIn } from "$lib/treedefinition";
  import outputJson from "$lib/output.json";
  import { page } from "$app/stores";
  import {
    TreeView,
    TreeViewItem,
    RecursiveTreeView,
  } from "@skeletonlabs/skeleton";
  import type { TreeViewNode } from "$lib/treedefinition";
  let myTreeView: RecursiveTreeView;
  let expandedNodes: string[] = [];
  const superFrm = superForm(data.form, { validators: adminToolsSchema });
  let singleCheckedNodes: string[] = [];
  const { admin, user, form } = data;
  let theFormStore: Writable<any> = superFrm.form;
  let debugCollapsed: boolean = false;
  let result: any = null;
  let treeItems: TreeViewItem[] = [];
  // $: {
  //   try {
  //     if ($theFormStore?.result) result = JSON.parse($theFormStore.result);
  //   } catch (error) {
  //     console.log("Error parsing query results", error);
  //   }
  // }

  $: if (singleCheckedNodes.length > 0) {
    console.log("singleCheckedNodes", singleCheckedNodes);
    let values = [
      $theFormStore.input1,
      $theFormStore.input2,
      $theFormStore.input3,
    ];
    let node = findNode(singleCheckedNodes[0], fixEscapeNodes);
    console.log("searching for node", singleCheckedNodes[0], node);
    if (node) {
      let command = node.command;
      let params = node.params;
      if (command && params) {
        $theFormStore.command = regExCommandBuild(command, params, values);
      }
    }

    // $theFormStore.result = values;
  }

  type TreeViewNodeExt = TreeViewNode & {
    command?: string;
    params?: string[];
  };
  let nodes = structuredClone(nodesIn);
  const temp = nodes as TreeViewNodeExt[];
  let nodesExt: TreeViewNodeExt[] = structuredClone(temp);
  const newMerged = structuredClone(outputJson) as TreeViewNodeExt[];
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
    // if (node?.id && exclude.indexOf(node.id) === -1) {
    if (node?.id) {
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
  let output: TreeViewNodeExt[] = [];
  function parseCommands(node: TreeViewNode) {
    let temp: TreeViewNodeExt = structuredClone(node) as TreeViewNodeExt;
    // This regular expression matches the API command pattern.
    const commandRegex = /pb\.[\w\.]+\(.+\);/g;

    // This regular expression matches the parameters inside parentheses.
    const paramsRegex = /\(([^)]+)\)/g;

    // Iterate over the nodes array.
    // sourceData.forEach((node) => {
    // Extract the API command from the content.
    const commandMatch = node.content.match(commandRegex);
    console.log("🚀 ~ sourceData.forEach ~ commandMatch:", commandMatch);

    if (commandMatch) {
      temp.command = commandMatch[0];

      // Extract the parameters from the command.
      const paramsMatch = temp.command.match(paramsRegex);
      console.log("🚀 ~ sourceData.forEach ~ paramsMatch:", paramsMatch);
      if (paramsMatch) {
        // Split the parameters by comma and trim whitespace.
        // temp.params = paramsMatch[1].split(",").map((param) => param.trim());
        temp.params = paramsMatch;
        console.log("🚀 ~ sourceData.forEach ~ node.params:", temp.params);
      }
    }

    output.push(temp);
    if (node?.children)
      node.children.forEach((node: TreeViewNode) => {
        // console.log(node.id);
        parseCommands(node);
      });
  }

  function regExCommandBuild(
    command: string,
    params: string[],
    values: string[]
  ) {
    let result = command;
    params = params.map((param) => {
      return param.replace("(", "").replace(")", "");
    });
    let paramsString = params.join("|");
    let paramsRegex = new RegExp(`(${paramsString})`, "g");
    result = result.replace(paramsRegex, (match, p1) => {
      console.log("🚀 ~ paramsRegex:", paramsRegex);
      let index = params.indexOf(escapeRegExp(p1));
      console.log("🚀 ~ regExCommandBuild ~ index,p1", index, p1);
      if (index !== -1) {
        console.log("🚀 ~ regExCommandBuild ~ values[index]", values[index]);
        return values[index];
      } else {
        console.log("🚀 ~ regExCommandBuild ~ match", match);
        return match;
      }
    });
    console.log("🚀 ~ regExCommandBuild ~ result", result);
    return result;
  }

  function findNode(
    nodeId: string,
    nodes: TreeViewNodeExt[]
  ): TreeViewNodeExt | undefined {
    let result: TreeViewNodeExt | undefined = undefined;
    nodes.forEach((node) => {
      if (node.id === nodeId) {
        result = node;
      } else if (node?.children) {
        let temp = findNode(nodeId, node.children);
        if (temp) result = temp;
      }
    });
    return result;
  }
  let fixEscapeNodes: TreeViewNodeExt[] = structuredClone(
    outputJson
  ) as TreeViewNodeExt[];

  function fixEscapes(node: TreeViewNodeExt, parent?: TreeViewNodeExt) {
    let parentIdx: number = -1;
    if (parent?.children) {
      parentIdx = parent.children.indexOf(node);
    }
    if (node?.params) {
      node.params = node.params.map((param) => {
        return escapeRegExp(param.replace("(", "").replace(")", ""));
      });
    }
    if (parent?.children) {
      parent.children[parentIdx] = node;
    }
    if (node?.children) {
      node.children.forEach((child: TreeViewNodeExt) => {
        fixEscapes(child, node);
      });
    }
  }

  function mergeTree(node: TreeViewNodeExt, parent?: TreeViewNodeExt) {
    const command = output.find((item) => item.id === node.id)?.command;
    const params = output.find((item) => item.id === node.id)?.params;
    let parentIdx: number = -1;
    if (parent?.children) {
      parentIdx = parent.children.indexOf(node);
      // console.log(
      //   "🚀 ~ mergeTree ~ recording idx from parent:",
      //   node,
      //   parent.children,
      //   parentIdx
      // );
    }
    node = {
      ...node,
      command,
      params,
    };
    // console.log("🚀 ~ mergeTree ~ new node:", node);
    if (parent?.children) {
      parent.children[parentIdx] = node;
      // console.log(
      //   "🚀 ~ mergeTree ~ added to parent:",
      //   node,
      //   parent.children,
      //   parentIdx
      // );
    } else {
      // console.log("🚀 ~ mergeTree ~ added to root:", node, nodesExt);
      nodesExt[0] = node;
    }

    if (node?.children) {
      node.children.forEach((child: TreeViewNodeExt) => {
        mergeTree(child, node);
      });
    }
  }
  function test() {
    fixEscapes(fixEscapeNodes[0]);
    console.log("nodesFixedEscapes!", fixEscapeNodes);

    // console.log(JSON.stringify(temp2, null, 2));
    // mergeTree(nodesExt[0]);
    // console.log("output!", output);
    // console.log(JSON.stringify(nodesExt, null, 2));
  }

  // let exclude = ["crud", "Realtime handlers"];
  let exclude = [""];
  // parseCommands(nodes[0]);
  toggleTree(nodes[0], true);
  test();
  function escapeRegExp(str: string) {
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  const paramVariations = [
    "collectionIdOrName",
    "page = 1, perPage = 30, options = {}",
    "options = {}",
    "filter, options = {}",
    "recordId, options = {}",
    "bodyParams = {}, options = {}",
    "recordId, bodyParams = {}, options = {}",
    "topic, callback, options = {}",
    "[topic]",
    "usernameOrEmail, password, options = {}",
    "authConfig",
    "provider, code, codeVerifier, redirectUrl, createData = {}, options = {}",
    "email, options = {}",
    "resetToken, newPassword, newPasswordConfirm, options = {}",
    "verificationToken, options = {}",
    "newEmail, options = {}",
    "emailChangeToken, userPassword, options = {}",
    "recordId, provider, options = {}",
    "email, password, options = {}",
    "id, options = {}",
    "id, bodyParams = {}, options = {}",
    "collections, deleteMissing = false, options = {}",
    'filesystem = "storage", options = {}',
    "toEmail, template, options = {}",
    "clientId, teamId, keyId, privateKey, duration, options = {} {}",
    "topic?",
    "topicPrefix",
    "topic, callback",
    'basename = "", options = {}',
    "{ file: File/Blob }, options = {}",
    "key, options = {}",
    "token, key",
    "record, filename, options = {}",
    "options = {}",
  ];
</script>

<div class="flex flex-col space-y-3 p-6 justify-center flex-auto ml-auto">
  <div>
    <h1 class="text-center">Admin Tool Box</h1>
  </div>
  <div class="self-center">
    <Button
      on:click={() => {
        // test();
        debugCollapsed = !debugCollapsed;
      }}
      >Toggle Debug
    </Button>
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
    <Button
      on:click={() => {
        test();
        // parseCommands(nodes[0]);
        // console.log("output!", output);
      }}>test</Button
    >

    <!-- on:toggle={(e) => {
        console.log("Expanded Nodes", expandedNodes);
        // console.log("this", myTreeView);
        // console.log("expandedNodes", expandedNodes);
        // console.log("treeItems", treeItems);
        // console.log("nodes", nodes);
        // console.log("checkedNodes", singleCheckedNodes);
        // console.log("myTreeView", myTreeView);
      }} -->
  </div>
  <div>
    <RecursiveTreeView
      selection
      nodes={newMerged}
      bind:checkedNodes={singleCheckedNodes}
      bind:expandedNodes
    />
  </div>

  <Form.Root
    form={superFrm}
    controlled
    schema={adminToolsSchema}
    let:config
    method="post"
    debug={false}
    class="p-4 space-y-3 rounded-lg shadow-lg"
  >
    <Form.Field {config} name="command">
      <Form.Label>Command</Form.Label>
      <Form.Input class="input" placeholder="Command Builder" disabled />

      <Form.Validation />
    </Form.Field>
    <Form.Field {config} name="result">
      <Form.Item>
        <Form.Label>result</Form.Label>
        <Form.Textarea placeholder="Waiting" class="resize-none" />

        <Form.Validation />
      </Form.Item>
    </Form.Field>
    <!-- <input type="hidden" name="result" /> -->
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
      <Form.Field {config} name="input3">
        <Form.Label>input3</Form.Label>
        <Form.Input />

        <Form.Validation />
      </Form.Field>
      <Form.Button>Submit</Form.Button>
    </Form.Item>
  </Form.Root>

  <SuperDebug
    data={{
      // myTreeView,
      $page,
      result,
      $theFormStore,
      singleCheckedNodes,
      //nodesExt,
      //expandedNodes,
      //nodes,
    }}
    collapsible
    bind:collapsed={debugCollapsed}
  />
</div>
