//import { useCookie } from "nuxt/dist/app/composables";
import cookie from "cookie";
import { useLoggedInUser } from "@/stores/StoreAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();

  if (process.server) {
    const cookieHeader = nuxtApp.ssrContext.event.req.headers["cookie"] || "";
    const cookies = cookie.parse(cookieHeader);

    if (cookies["token"]) {
      const user = useLoggedInUser();
      user.fetchUser(cookies["token"]);
    }
  }
});
