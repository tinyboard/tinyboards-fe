import { useLoggedInUser } from "@/stores/StoreAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useLoggedInUser();
  //console.log("admin check");
  // Redirect to login if page requires authenticated session.
  // Redirect to feed if page requires unauthenticated session.
  if (userStore.user && !userStore.user.is_admin && to.meta.isAdminRequired) {
    return navigateTo("/feed");
  }
});
