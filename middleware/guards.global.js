// Route guards.
// Each rule is evaluated top to bottom.

import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "~~/stores/StoreSite";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useLoggedInUser();
  const site = useSiteStore();

  // On server-side, check for token in cookies directly to avoid hydration issues
  if (process.server) {
    const token = useCookie('token');

    // If there's a token, assume user is authenticated for SSR
    // The client-side auth plugin will verify the token properly
    const hasToken = !!token.value;

    // Only redirect on server if there's definitely no token and auth is required
    if (!hasToken && to.meta.hasAuthRequired) {
      return navigateTo("/login");
    }
    // Don't redirect authenticated users on server - let client handle it
    return;
  }

  // Client-side logic (after hydration)
  if (process.client) {
    // Redirect to login if page requires authenticated session.
    // Redirect to feed if page requires unauthenticated session.
    if (!userStore.isAuthed && to.meta.hasAuthRequired) {
      return navigateTo("/login");
    } else if (userStore.isAuthed && to.meta.isAuthAllowed === false) {
      return navigateTo("/feed");
    }
  }
});
