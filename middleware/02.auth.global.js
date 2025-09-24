import cookie from "cookie";
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useAPI } from "@/composables/api";
import { useToastStore } from "@/stores/StoreToast";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*const nuxtApp = useNuxtApp();
  const userStore = useLoggedInUser();
  const toast = useToastStore();

  if (process.server) {
    //console.log("auth middleware");

    const cookieHeader = nuxtApp.ssrContext.event.req.headers["cookie"] || "";
    const cookies = cookie.parse(cookieHeader);

    const jwt = cookies["token"];

    if (cookies["token"]) {
      await useAPI("/me", {
        key: `get_user_${jwt}`,
      }).then(({ data, error }) => {
        if (data.value) {
          userStore.user = data.value.user;
          userStore.counts = data.value.counts;
          userStore.unread = data.value.unread_notifications;
          userStore.token = jwt;
          userStore.isAuthed = true;
          userStore.adminLevel = data.value.adminLevel;
          userStore.joinedBoards = data.value.subscribed_boards;
          userStore.moddedBoards = data.value.moderated_boards;

          if (userStore.user.isBanned) {
            // Number of days until unban
            const unbanDays = (function () {
              if (userStore.user.unban_date) {
                const date = new Date(userStore.user.unban_date);

                return Math.ceil(
                  (Math.floor(date.getTime() / 1000) -
                    Math.floor(Date.now() / 1000)) /
                    (60 * 60 * 24)
                );
              } else {
                return null;
              }
            })();

            const banStr = userStore.user.unban_date
              ? `suspended for ${unbanDays} day(s).`
              : "permanently banned.";

            toast.addNotification({
              header: "You are banned",
              message: "Your account has been " + banStr,
              type: "error",
            });
          }
        } else {
          console.log(error.value);
        }
      });
    }
    }*/
});
