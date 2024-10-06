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

  const { data, error } = await useAsyncQuery(
    gql`
      query getSite(
        $boardName: String
        $shouldLoadSite: Boolean!
        $shouldLoadBoard: Boolean!
      ) {
        site @include(if: $shouldLoadSite) {
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
        board(name: $boardName) @include(if: $shouldLoadBoard) {
          name
          title
          description
          icon
          banner
          primaryColor
          secondaryColor
          hoverColor
          creationDate
          isNsfw
          isRemoved
          banReason
          sidebarHtml
          isHidden
          subscribers
          postCount
          commentCount
          myModPermissions
          moderators {
            person {
              name
              displayName
              avatar
            }
          }
        }
      }
    `,
    {
      // site is loaded on initial load - during SSR
      shouldLoadSite: process.server,
      // board is loaded if the user visits any pages under "/+board/*"
      shouldLoadBoard: to.params.hasOwnProperty("board"),
      boardName: to.params.board,
    },
  );

  if (data.value.site) {
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
  } else if (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: `Error occured while fetching site: ${JSON.stringify(error, null, 4)}`,
      fatal: true,
    });
  }

  if (data.value.board) {
    boardStore.setBoard(data.value.board);
  } else {
    boardStore.clear();
  }
});
