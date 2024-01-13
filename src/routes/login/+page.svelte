<script lang="ts">
  import type { PageData } from "./$types";
  import { loginUserDto } from "$lib/Schemas";
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

  export let data: PageData;
  const debug: Writable<boolean> = getContext("debug");

  const oauthSignup = async (
    e: Event,
    provider: string = "google"
  ): Promise<void> => {
    if (!data.validAuthProviders.includes(provider)) {
      throw new Error("Invalid auth provider");
    }
    if (browser) {
      try {
        //const clientPB = new PocketBase(PUBLIC_PB_HOST);
        let w = window.open();
        const result = await pb.collection("users").authWithOAuth2({
          provider: provider,
          urlCallback: (url) => {
            w!.location.href = url;
          },
        });
        console.log("check result", result);
        console.log("Check oauth", pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log("Username", pb.authStore?.model);
        invalidateAll();
      } catch (error) {
        console.log("oauth error", error);
      }
    }
  };
  // clientPB
  //   .collection("users")
  //   .authWithOAuth2({ provider: "google" })
  //   .then((res) => {
  //     console.log(clientPB.authStore.isValid);
  //     console.log(clientPB.authStore.token);
  //     console.log("Username", clientPB.authStore?.model?.username);
  //     console.log("Email", clientPB.authStore?.model?.email);
  //     console.log("Verified", clientPB.authStore?.model?.verified);
  //     console.log("Id", clientPB.authStore?.model?.id);
  // });

  $: form = data?.form;

  // $: form2 = data2?.form;

  $: console.log("login page data:", data);
  // $: console.log("login page data2:", data2);
</script>

<div class="flex flex-col items-center flex-auto">
  <h2 class="h2">Login</h2>

  <div class="flex items-center justify-between">
    {#if form}
      <Form.Root
        {form}
        class="flex flex-col space-y-2"
        schema={loginUserDto}
        action="?/login"
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
