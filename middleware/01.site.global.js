import cookie from "cookie";
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useGraphQLQuery } from "@/composables/useGraphQL";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const siteStore = useSiteStore();
  const boardStore = useBoardStore();
  const userStore = useLoggedInUser();
  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();

  // Get cookies safely for SSR
  let cookies = {};
  if (process.server) {
    const cookieHeader = useNuxtApp().ssrContext?.event.req.headers["cookie"] || "";
    cookies = cookie.parse(cookieHeader);
  } else {
    // Client-side cookie access
    const tokenCookie = useCookie('token');
    if (tokenCookie.value) {
      cookies.token = tokenCookie.value;
    }
  }

  // Validate token format if present
  const hasValidToken = cookies.token &&
    typeof cookies.token === 'string' &&
    cookies.token.length > 10; // Basic validation

  // Use the original initApp query with improved error handling
  try {
    if (process.dev) {
      console.log(`🔍 Middleware GraphQL request [${process.server ? 'SSR' : 'Client'}] for initApp`);
    }

    // Be more conservative about loading user data during SSR to prevent auth errors
    const shouldLoadUser = hasValidToken && (!process.server || process.dev);

    const initAppQuery = `
      query InitApp($shouldLoadSite: Boolean!, $shouldLoadLoggedInUser: Boolean!, $shouldLoadBoard: Boolean!, $boardName: String!) {
        site @include(if: $shouldLoadSite) {
          name
          description
          icon
          homepageBanner
          primaryColor
          secondaryColor
          hoverColor
          enableDownvotes
          enableNSFW
          applicationQuestion
          privateInstance
          inviteOnly
          requireApplication
          boardsEnabled
          boardCreationAdminOnly
          requireEmailVerification
        }
        me @include(if: $shouldLoadLoggedInUser) {
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
          creationDate
          postCount
          commentCount
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
        unreadRepliesCount @include(if: $shouldLoadLoggedInUser)
        unreadMentionsCount @include(if: $shouldLoadLoggedInUser)
        board(name: $boardName) @include(if: $shouldLoadBoard) {
          id
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
          subscribedType
          moderators {
            user {
              name
              displayName
              avatar
            }
          }
        }
      }
    `;

    const { data, error } = await useGraphQLQuery(initAppQuery, {
      variables: {
        shouldLoadSite: true,
        shouldLoadLoggedInUser: shouldLoadUser,
        shouldLoadBoard: !!to.params?.board,
        boardName: to.params?.board || '',
      },
    });

    if (error.value) {
      // Handle GraphQL errors gracefully
      if (process.dev) {
        console.warn('GraphQL error in middleware:', error.value);
      }

      // If it's an auth error, clear the invalid token
      if (error.value.isAuthError && process.client) {
        const tokenCookie = useCookie('token');
        tokenCookie.value = null;
        if (process.dev) {
          console.warn('🔐 Cleared invalid token due to auth error in middleware');
        }
      }

      // Don't throw, just continue with empty data
    }

    if (data.value && data.value.site) {
      siteStore.name = data.value.site?.name ?? '';
      siteStore.description = data.value.site?.description ?? '';
      siteStore.icon = data.value.site?.icon ?? '';
      siteStore.homepageBanner = data.value.site?.homepageBanner ?? null;
      siteStore.primaryColor = data.value.site?.primaryColor ?? '';
      siteStore.secondaryColor = data.value.site?.secondaryColor ?? '';
      siteStore.hoverColor = data.value.site?.hoverColor ?? '';
      siteStore.enableDownvotes = data.value.site?.enableDownvotes ?? false;
      siteStore.enableNSFW = data.value.site?.enableNSFW ?? false;
      siteStore.applicationQuestion = data.value.site?.applicationQuestion ?? '';
      siteStore.isPrivate = data.value.site?.privateInstance ?? false;
      siteStore.enableBoards = data.value.site?.boardsEnabled ?? false;
      siteStore.boardCreationAdminOnly = data.value.site?.boardCreationAdminOnly ?? false;
      siteStore.requireEmailVerification = data.value.site?.requireEmailVerification ?? false;
      siteStore.requireApplication = data.value.site?.requireApplication ?? false;
      siteStore.inviteOnly = data.value.site?.inviteOnly ?? false;
    }

    if (data.value && data.value.me) {
      userStore.user = data.value.me;
      userStore.unread = (data.value.unreadRepliesCount || 0) + (data.value.unreadMentionsCount || 0);
      userStore.token = cookies["token"];
      userStore.isAuthed = true;
      userStore.adminLevel = data.value.me.adminLevel;
      userStore.joinedBoards = data.value.me.joinedBoards;
      userStore.moddedBoards = data.value.me?.moderates?.map((m) => m.board) ?? [];
    }

    if (data.value && data.value.board) {
      boardStore.setBoard(data.value.board);

      const recentBoards = useCookie("recentBoards");
      if (!recentBoards.value) {
        recentBoards.value = [];
      }

      if ((recentBoards.value ?? []).filter((b) => b?.name == data.value.board?.name).length == 0) {
        recentBoards.value.unshift({
          name: data.value.board?.name ?? '',
          title: data.value.board?.title ?? '',
          icon: data.value.board?.icon ?? '',
        });
        recentBoards.value = recentBoards.value.slice(0, 5);
      } else {
        recentBoards.value = (recentBoards.value ?? []).filter((b) => b?.name != data.value.board?.name);
        recentBoards.value.unshift({
          name: data.value.board?.name ?? '',
          title: data.value.board?.title ?? '',
          icon: data.value.board?.icon ?? '',
        });
      }
    }
  } catch (error) {
    // Handle any other errors gracefully
    if (process.dev) {
      console.warn('Error in middleware:', error);
    }
  }

  // Clear posts and comments on route change
  postsStore.clear();
  commentsStore.setComments([]);
});
