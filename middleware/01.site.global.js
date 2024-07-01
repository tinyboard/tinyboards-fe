import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
import { useApi } from "@/composables/api";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const siteStore = useSiteStore();
  const boardStore = useBoardStore();
  const route = useRoute();
  //console.log("fetch site...");

  if (process.server) {
    await useApi("/admin/site").then(({ data, error }) => {
      if (data.value) {
        siteStore.siteMode = data.value.site_mode;
        siteStore.name = data.value.name;
        siteStore.description = data.value.description;
        siteStore.icon = data.value.icon;
        siteStore.primaryColor = data.value.primary_color;
        siteStore.secondaryColor = data.value.secondary_color;
        siteStore.hoverColor = data.value.hover_color;
        siteStore.enableDownvotes = data.value.enable_downvotes;
        siteStore.enableNSFW = data.value.enable_nsfw;
        siteStore.applicationQuestion = data.value.application_question;
        siteStore.isPrivate = data.value.private_instance;
        siteStore.enableBoards = data.value.boards_enabled;
        siteStore.boardCreationAdminOnly = data.value.board_creation_admin_only;
        siteStore.requireEmailVerification =
          data.value.require_email_verification;
      } else {
        console.log(error.value);
      }
    });
  }

  console.log(`middleware, route changed to ${to.fullPath}`);
  if (siteStore.enableBoards && to.params.hasOwnProperty("board")) {
    await boardStore.load({ name: to.params.board });
  } else if (boardStore.boardActive) {
    boardStore.clear();
  }
});