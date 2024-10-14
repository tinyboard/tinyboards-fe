import cookie from "cookie";
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useApi } from "@/composables/api";
import gql from "graphql-tag";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const siteStore = useSiteStore();
  const boardStore = useBoardStore();
  const route = useRoute();
  const userStore = useLoggedInUser();
  //console.log("fetch site...");

  const cookieHeader = nuxtApp.ssrContext?.event.req.headers["cookie"] || "";
  const cookies = cookie.parse(cookieHeader);

  const jwt = cookies["token"];

  const { data, error } = await useAsyncQuery(
    gql`
      query getSite(
        $boardName: String
        $shouldLoadSite: Boolean!
        $shouldLoadLoggedInUser: Boolean!
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
          enableNSFW
          applicationQuestion
          privateInstance
          boardsEnabled
          boardCreationAdminOnly
          requireEmailVerification
        }
        me @include(if: $shouldLoadLoggedInUser) {
          person {
            id
            name
            displayName
            isBanned
            unbanDate
            avatar
            adminLevel
            rep
            postScore
            commentScore
            joinedBoards {
              icon
              name
              title
              subscribers
            }
            moderates {
              board {
                icon
                name
                title
                subscribers
              }
            }
          }
          unreadRepliesCount
          unreadMentionsCount
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
          isNSFW
          isBanned
          banReason
          sidebarHTML
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
      // logged in user is loaded during SSR if there is a stored auth token
      shouldLoadLoggedInUser: process.server && cookies["token"] !== undefined,
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
    siteStore.enableNSFW = site.enableNSFW;
    siteStore.applicationQuestion = site.applicationQuestion;
    siteStore.isPrivate = site.privateInstance;
    siteStore.enableBoards = site.boardsEnabled;
    siteStore.boardCreationAdminOnly = site.boardCreationAdminOnly;
    siteStore.requireEmailVerification = site.requireEmailVerification;
  } /*else if (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: `Error occured while fetching site: ${JSON.stringify(error, null, 4)}`,
      fatal: true,
    });
    }*/

  if (data.value.board) {
    boardStore.setBoard(data.value.board);
  } else {
    boardStore.clear();
  }

  if (data.value.me) {
    userStore.user = data.value.me.person;
    userStore.counts = {
      rep: 0,
    };
    userStore.unread =
      data.value.me.unreadRepliesCount + data.value.me.unreadMentionsCount;
    userStore.token = cookies["token"];
    userStore.isAuthed = true;
    userStore.adminLevel = data.value.me.person.adminLevel;
    userStore.joinedBoards = data.value.me.person.joinedBoards;
    userStore.moddedBoards = data.value.me.person.moderates.map((m) => m.board);
  }
});
