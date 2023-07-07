import cookie from "cookie";
import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const userStore = useLoggedInUser();

  if (process.server) {
    const cookieHeader = nuxtApp.ssrContext.event.req.headers["cookie"] || "";
    const cookies = cookie.parse(cookieHeader);

    const jwt = cookies["token"];

    if (cookies["token"]) {
      await useFetch("/me", {
        baseURL,
        key: `get_user_${jwt}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      })
      .then(({ data }) => {
        userStore.user = data.value.person;
        userStore.counts = data.value.counts;
        userStore.unread = data.value.unread_notifications;
        userStore.token = jwt;
        userStore.isAuthed = true;
      })
    }
  };
});
