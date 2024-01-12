<script lang="ts">
  import type { PageData } from "./$types";
  import { loginUserDto, userSchema } from "$lib/Schemas";
  import * as Form from "$lib/components/ui/form";
  import * as Alert from "$lib/components/ui/alert";
  import { getForm } from "formsnap";
  import { writable, type Writable } from "svelte/store";
  import { getContext } from "svelte";
  import PocketBase from "pocketbase";
  import { PUBLIC_PB_HOST } from "$env/static/public";

  export let data: PageData;
  const debug: Writable<boolean> = getContext("debug");
  const clientPB = new PocketBase(PUBLIC_PB_HOST);

  const oauthSignup = async (
    e: Event,
    provider: string = "google"
  ): Promise<void> => {
    if (!data.validAuthProviders.includes(provider)) {
      throw new Error("Invalid auth provider");
    }

    clientPB
      .collection("users")
      .authWithOAuth2({ provider: "google" })
      .then((res) => {
        console.log(clientPB.authStore.isValid);
        console.log(clientPB.authStore.token);
        console.log("Username", clientPB.authStore?.model?.username);
        console.log("Email", clientPB.authStore?.model?.email);
        console.log("Verified", clientPB.authStore?.model?.verified);
        console.log("Id", clientPB.authStore?.model?.id);
      });
  };

  $: form = data?.form;

  // $: form2 = data2?.form;

  $: console.log("signup page data:", data);
  // $: console.log("login page data2:", data2);
</script>

<div class="flex flex-col items-center flex-auto">
  <h2 class="h2">New User Signup</h2>

  <div class="flex items-center justify-between">
    {#if form}
      <Form.Root
        {form}
        class="flex flex-col space-y-2"
        schema={userSchema}
        action="?/register"
        let:config
        debug={$debug}
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
          <Form.Field {config} name="username">
            <Form.Label>Username</Form.Label>
            <Form.Input />
            <Form.Description>Username</Form.Description>
            <Form.Validation />
          </Form.Field>
        </Form.Item>
        <Form.Item>
          <Form.Field {config} name="email">
            <Form.Label>Email</Form.Label>
            <Form.Input />
            <Form.Description>Email</Form.Description>
            <Form.Validation />
          </Form.Field>
        </Form.Item>
        <Form.Item>
          <Form.Field {config} name="name">
            <Form.Label>Name</Form.Label>
            <Form.Input />
            <Form.Description>Name (optional)</Form.Description>
            <Form.Validation />
          </Form.Field>
        </Form.Item>
        <Form.Field {config} name="password">
          <Form.Label>Password</Form.Label>
          <Form.Input type="password" />
          <Form.Description>Enter your password</Form.Description>
          <Form.Validation />
        </Form.Field>
        <Form.Field {config} name="passwordConfirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Input type="password" />
          <Form.Description>Confirm your password</Form.Description>
          <Form.Validation />
        </Form.Field>
        <Form.Button>Sign Up!</Form.Button>
        <br />
        <Form.Button type="button" class="btn-auth" on:click={oauthSignup}>
          <img
            class="btn-auth-img"
            src="/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png"
            alt="google sign in"
          />
        </Form.Button>
      </Form.Root>
    {:else}
      <p>Loading...</p>
    {/if}
  </div>
</div>

<style>
  .btn-auth-img:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  }
  .btn-auth {
    border: 0;
    background-color: rgba(84, 81, 81, 0);
    padding: 0.01em;
  }
  .btn-auth:hover {
    border: 0;
    padding: 0.01em;
    text-decoration: none;
    background-color: rgba(84, 81, 81, 0);
  }
</style>
