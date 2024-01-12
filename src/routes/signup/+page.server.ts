import type { PageServerLoad } from "./$types";
import { userSchema, userAdds, userDB, userAddVerify } from "$lib/Schemas";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import type { z } from "zod";
type UserAdds = z.infer<typeof userAdds>;
const validAuthProviders = ["google"];
export const load = (async ({ url, locals }) => {
  // if (locals.pb.authStore.isValid) {
  //   console.log("already logged in");
  //   throw redirect(303, "/");
  // }

  const form = await superValidate(userAddVerify);
  return { form, validAuthProviders };
}) satisfies PageServerLoad;

export const actions = {
  register: async ({ locals, request }) => {
    const formData = await superValidate(request, userAddVerify);
    console.log("formData-start of register", formData);
    let returnForm;
    if (!formData.valid) {
      returnForm = {
        userName: formData.data.username,
        email: formData.data.email,
        name: formData.data.name,
        password: "",
        passwordConfirm: "",
      };
      console.log(
        "🚀 ~ file: +page.server.ts:31 ~ register: ~ returnForm:",
        returnForm
      );
      return fail(400, returnForm);
    }
    const createUserObj: UserAdds = {
      username: formData.data.username,
      email: formData.data.email,
      password: formData.data.password,
      passwordConfirm: formData.data.passwordConfirm,
      name: formData.data.name,
    };
    console.log("createUserObj", createUserObj);
    try {
      const newUser = await locals.pb
        ?.collection("Users")
        .create(createUserObj);

      const auth = await locals.pb
        .collection("users")
        .authWithPassword(createUserObj.email, createUserObj.password);
      console.log("🚀 ~ file: +page.server.ts:53 ~ register: ~ auth:", auth);

      locals.pb.authStore.clear();
    } catch (err) {
      console.log("Error:", err);
      return fail(400, {
        returnForm,
      });
    }

    throw redirect(303, "/login");
  },
  OAuth2: async ({ cookies, url, locals }) => {
    const authMethods = await locals.pb?.collection("users").listAuthMethods();
    //console.log("authmethods", authMethods);
    if (!authMethods) {
      return {
        authProviderRedirect: "",
        authProviderState: "",
      };
    }
    const redirectURL = `${url.origin}/oauth`;
    const googleAuthProvider = authMethods.authProviders[0];
    const authProviderRedirect = `${googleAuthProvider.authUrl}${redirectURL}`;
    const state = googleAuthProvider.state;
    const verifier = googleAuthProvider.codeVerifier;

    cookies.set("state", state, { path: "/" });
    cookies.set("verifier", verifier, { path: "/" });

    throw redirect(302, authProviderRedirect);
  },
};
