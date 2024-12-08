import cookie from "cookie";
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useApi } from "@/composables/api";
import gql from "graphql-tag";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const siteStore = useSiteStore();
  const boardStore = useBoardStore();
  const userStore = useLoggedInUser();
  //console.log("fetch site...");

  const cookieHeader = nuxtApp.ssrContext?.event.req.headers["cookie"] || "";
  const cookies = cookie.parse(cookieHeader);

  const jwt = cookies["token"];

  //clear posts
  usePostsStore().clear();
  // clear comments
  useCommentsStore().setComments([]);

  const { data, error } = await useAsyncGql({
    operation: 'getSite',
    variables: {
      // site is loaded on initial load - during SSR
      shouldLoadSite: process.server,
      // logged in user is loaded during SSR if there is a stored auth token
      shouldLoadLoggedInUser: process.server && cookies["token"] !== undefined,
      // board is loaded if the user visits any pages under "/+board/*"
      shouldLoadBoard: to.params.hasOwnProperty("board"),
      boardName: to.params.board,
    },
  });

  console.log("got here");

  console.log(JSON.stringify(data.value, null, 4));
  if (data.value.site) {
    console.log("AAAAAAAAAAAA");
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
    const recentBoards = useCookie("recentBoards");
    boardStore.setBoard(data.value.board);

    if (!recentBoards.value) {
      recentBoards.value = [];
    }

    // new board
    if (
      recentBoards.value.filter((board) => board.name == data.value.board.name)
        .length == 0
    ) {
      recentBoards.value.unshift({
        name: data.value.board.name,
        title: data.value.board.title,
        icon: data.value.board.icon,
      });

      // only the 5 most recently viewed boards are stored
      recentBoards.value = recentBoards.value.slice(0, 5);
    } else {
      // board already listed: move it to the top
      recentBoards.value = recentBoards.value.filter(
        (board) => board.name != data.value.board.name,
      );

      recentBoards.value.unshift({
        name: data.value.board.name,
        title: data.value.board.title,
        icon: data.value.board.icon,
      });
    }
  } else {
    boardStore.clear();
  }

  if (data.value.me) {
    userStore.user = data.value.me;
    /*userStore.counts = {
      rep: 0,
    };*/
    userStore.unread =
      data.value.unreadRepliesCount + data.value.unreadMentionsCount;
    userStore.token = cookies["token"];
    userStore.isAuthed = true;
    userStore.adminLevel = data.value.me.adminLevel;
    userStore.joinedBoards = data.value.me.joinedBoards;
    userStore.moddedBoards = data.value.me.moderates.map((m) => m.board);
  }
});
