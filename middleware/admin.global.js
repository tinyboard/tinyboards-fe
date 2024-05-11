import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "~~/composables/admin";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useLoggedInUser();
  //console.log("admin check");
  // Redirect to login if page requires authenticated session.
  // Redirect to feed if page requires unauthenticated session.
  if (
    to.meta.hasOwnProperty("permissionRequired") &&
    !requirePermission(to.meta.permissionRequired)
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "You are NOT welcome here. GO AWAY!",
      fatal: true,
    });
  }
});
