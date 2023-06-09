import cookie from "cookie";
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useApi } from "@/composables/api";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const userStore = useLoggedInUser();

  if (process.server) {
    const cookieHeader = nuxtApp.ssrContext.event.req.headers["cookie"] || "";
    const cookies = cookie.parse(cookieHeader);

    const jwt = cookies["token"];

    if (cookies["token"]) {
      await useApi("/me", {
        key: `get_user_${jwt}`,
      }).then(({ data, error }) => {
        if (data.value) {
          userStore.user = data.value.person;
          userStore.counts = data.value.counts;
          userStore.unread = data.value.unread_notifications;
          userStore.token = jwt;
          userStore.isAuthed = true;
        } else {
          console.log(error.value);
        }
      });
    }
  }
});
