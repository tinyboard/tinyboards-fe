// Route guards.
// Each rule is evaluated top to bottom.

import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "~~/stores/StoreSite";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useLoggedInUser();
  const site = useSiteStore();
  // Redirect to login if page requires authenticated session.
  // Redirect to feed if page requires unauthenticated session.
  if (
    !userStore.isAuthed &&
    (to.meta.hasAuthRequired ||
      (site.isPrivate && to.meta.isAuthAllowed != false))
  ) {
    return navigateTo(`/login?to=${to.path}`);
  } else if (userStore.isAuthed && to.meta.isAuthAllowed === false) {
    return navigateTo("/feed");
  }
});
