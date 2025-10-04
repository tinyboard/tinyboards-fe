import { useLoggedInUser } from '@/stores/StoreAuth';
import { useDirectGraphQLRequest } from '@/composables/useGraphQL';

export default defineNuxtPlugin(() => {
  const userStore = useLoggedInUser();
  const route = useRoute();

  // Only run on client side for client-only pages (ssr: false)
  // For SSR pages, the middleware (01.site.global.js) already fetches user data
  if (process.client) {
    const token = useCookie('token');

    // If there's a token but no user data (client-only page), fetch user data
    if (token.value && !userStore.user) {
      // Fetch user data in the background
      useDirectGraphQLRequest(`
          query GetLoggedInUser {
            me {
              id
              name
              displayName
              avatar
              moderates {
                board {
                  id
                  name
                }
              }
              isAdmin
              adminLevel
            }
            unreadMentionsCount
            unreadRepliesCount
          }
        `).then(({ data, error }) => {
          if (data.value?.me && !error.value) {
            const user = data.value.me;
            const moderates = user.moderates?.map((m: any) => m.board) || [];
            const joined = user.joinedBoards || [];

            // Set auth state
            userStore.user = user;
            userStore.joinedBoards = joined;
            userStore.moddedBoards = moderates;
            userStore.adminLevel = user.adminLevel || 0;
            userStore.isAuthed = true;
            userStore.token = token.value;
            userStore.unread = (data.value.unreadMentionsCount || 0) + (data.value.unreadRepliesCount || 0);
          } else {
            // Invalid token, remove it
            token.value = null;
            userStore.logout();
          }
        }).catch((error) => {
          console.error('Auth initialization error:', error);
          // Error fetching user, remove token
          token.value = null;
          userStore.logout();
        });
    }
  }
});