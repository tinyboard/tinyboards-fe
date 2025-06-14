//import { useAPI } from "@/composables/api";
//import PROFILE_QUERY from "@/graphql/queries/UserProfile";
import { useSiteStore } from "@/stores/StoreSite";

/*export async function useFetchUser(username, query = {}) {
  return useAPI(`/user`, {
    key: `user_${username}`,
    query: {
      username,
      ...query
    }
  });
}*/

/**
 * Retrieve a user's profile. 
 * @param username Username of the user.
 * @param query Query parameters, such as post listing sort and limit.
 * @returns A `Promise` of a user profile.
 */
export async function useFetchUser(username: string, query = {}) {
  const site = useSiteStore();

  return useAsyncGql({
    operation: 'userProfile',
    variables: {
      username,
      includeBoard: site.enableBoards,
      ...query,
    }
  });
}
