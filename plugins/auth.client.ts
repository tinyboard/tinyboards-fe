import { useLoggedInUser } from '@/stores/StoreAuth';
import { useDirectGraphQLRequest } from '@/composables/useGraphQL';

export default defineNuxtPlugin(async () => {
  const userStore = useLoggedInUser();

  // Only run on client side and if not already authenticated
  if (process.client && !userStore.isAuthed) {
    const token = useCookie('token');

    // If there's a token, try to fetch user data
    if (token.value) {
      try {
        console.log('Initializing auth from token...');
        const { data, error } = await useDirectGraphQLRequest(`
          query GetLoggedInUser {
            me {
              id
              username
              display_name
              avatar
              boards_moderating {
                id
                name
              }
              is_admin
              adminLevel
            }
            unreadMentionsCount
            unreadRepliesCount
          }
        `);

        if (data.value?.me && !error.value) {
          console.log('Auth initialization successful');
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
          console.log('Auth initialization failed, removing invalid token');
          // Invalid token, remove it
          token.value = null;
          userStore.logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Error fetching user, remove token
        token.value = null;
        userStore.logout();
      }
    }
  }
});