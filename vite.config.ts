import { purgeCss } from "vite-plugin-tailwind-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss({
      safelist: {
        // any selectors that begin with "hljs-" will not be purged
        greedy: [/^hljs-/],
      },
    }),
  ],
  //https://ad49-76-30-100-247.ngrok-free.app/login?/login
  //   server: {
  //     proxy: {
  //       //   "/login?/login": {
  //       //     target: "http://localhost:5173", // your backend server
  //       //     changeOrigin: true,
  //       //     secure: false,
  //       //   },
  //       "/api/collection": {
  //         target: "http://localhost:5173", // your backend server
  //         changeOrigin: true,
  //         secure: false,
  //       },
  //     },
  //   },
});
