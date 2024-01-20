<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import Wrapper from "../wrapper.svelte";
  import { resetPassSchema } from "$lib/Schemas";
  import * as Alert from "$lib/components/ui/alert";
  import type { PageData } from "./$types";
  export let data;
</script>

<Wrapper title="Reset your password">
  <div slot="altaction">
    We'll send you an email with a link to reset your password.
  </div>
  <Form.Root
    form={data.form}
    class="flex flex-col space-y-2"
    schema={resetPassSchema}
    let:config
    debug={false}
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

    <Form.Item class="text-center">
      <Form.Field {config} name="email">
        <Form.Label>Email address</Form.Label>
        <Form.Input type="email" />
        <Form.Description>This is your public display name.</Form.Description>
        <Form.Validation />
      </Form.Field>
      <Form.Button>Submit</Form.Button>
    </Form.Item>
  </Form.Root>
  <p class="text-center">
    <a class="text-indigo-500 hover:underline cursor-pointer" href="/login"
      >login</a
    >
  </p>
</Wrapper>
