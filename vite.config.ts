import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        login: "login.html",
        register: "register.html",
        onePost: "one-post.html",
        oneProfile: "one-profile.html"
      }
    }
  }
});
