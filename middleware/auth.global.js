//import { useCookie } from "nuxt/dist/app/composables";
import cookie from "cookie";
import { useLoggedInUser } from "@/stores/StoreAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const userStore = useLoggedInUser();

  if (process.server) {
    const cookieHeader = nuxtApp.ssrContext.event.req.headers["cookie"] || "";
    const cookies = cookie.parse(cookieHeader);

    if (cookies["token"]) {
      userStore.fetchUser(cookies["token"]);
    }
  };

  // Redirect to login if page requires authenticated session.
  if (!userStore.isAuthed && to.meta.hasAuthRequired) {
    return navigateTo('/login');
  };

  // Redirect to 403 page if page requires admin permissions.
  // if (!userStore.isAuthed && to.meta.hasAdminRequired) {
  //   return navigateTo('/403');
  // };
});
