import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
import { useApi } from "@/composables/api";
import gql from "graphql-tag";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const siteStore = useSiteStore();
  const boardStore = useBoardStore();
  const route = useRoute();
  //console.log("fetch site...");

  if (process.server) {
    const { data, error } = await useAsyncQuery(gql`
      query getSite {
        site {
          name
          description
          icon
          primaryColor
          secondaryColor
          hoverColor
          enableDownvotes
          enableNsfw
          applicationQuestion
          privateInstance
          boardsEnabled
          boardCreationAdminOnly
          requireEmailVerification
        }
      }
    `);

    if (data.value) {
      const site = data.value.site;
      //siteStore.siteMode = site.siteMode;
      siteStore.name = site.name;
      siteStore.description = site.description;
      siteStore.icon = site.icon;
      siteStore.primaryColor = site.primaryColor;
      siteStore.secondaryColor = site.secondaryColor;
      siteStore.hoverColor = site.hoverColor;
      siteStore.enableDownvotes = site.enableDownvotes;
      siteStore.enableNSFW = site.enableNsfw;
      siteStore.applicationQuestion = site.applicationQuestion;
      siteStore.isPrivate = site.privateInstance;
      siteStore.enableBoards = site.boardsEnabled;
      siteStore.boardCreationAdminOnly = site.boardCreationAdminOnly;
      siteStore.requireEmailVerification = site.requireEmailVerification;
    } else {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: `Error occured while fetching site: ${error.value}`,
        fatal: true,
      });
    }
  }

  /*console.log(`middleware, route changed to ${to.fullPath}`);
  if (siteStore.enableBoards && to.params.hasOwnProperty("board")) {
    await boardStore.load({ name: to.params.board });
  } else if (boardStore.boardActive) {
    boardStore.clear();
    }*/
});
