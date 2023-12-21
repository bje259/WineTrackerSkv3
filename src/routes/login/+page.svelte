<script lang="ts">
  import type { PageData } from "./$types";
  import { loginUserDto } from "$lib/Schemas";
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import { getForm } from "formsnap";
  import { writable, type Writable } from "svelte/store";

  export let data: PageData;
</script>

<h2 class="h2">Login</h2>
<br />

<div class="flex items-center justify-between">
  <Form.Root
    form={data.form}
    schema={loginUserDto}
    action="?/login"
    let:config
    debug={true}
    let:message
    let:errors
  >
    {#if errors._errors}
      <Alert.Root>
        <Alert.Title>Uh oh!</Alert.Title>
        <Alert.Description>{errors._errors?.join(",")}</Alert.Description>
      </Alert.Root>
    {:else if message}
      <Alert.Root>
        <Alert.Title>Heads up!</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Root>
    {/if}

    <br />
    <Form.Item>
      <Form.Field {config} name="usernameOrEmail">
        <Form.Label>Username</Form.Label>
        <Form.Input />
        <Form.Description>Username or Email</Form.Description>
        <Form.Validation />
      </Form.Field>
    </Form.Item>
    <Form.Field {config} name="password">
      <Form.Label>Password</Form.Label>
      <Form.Input type="password" />
      <Form.Description>Enter your password</Form.Description>
      <Form.Validation />
    </Form.Field>
    <Form.Button>Log in</Form.Button>
  </Form.Root>
</div>
