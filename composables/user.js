//import { useApi } from "@/composables/api";
import PROFILE_QUERY from "@/graphql_queries/UserProfile";
import { useSiteStore } from "@/stores/StoreSite";

/*export async function useFetchUser(username, query = {}) {
  return useApi(`/user`, {
    key: `user_${username}`,
    query: {
      username,
      ...query
    }
  });
}*/

export async function useFetchUser(username, query = {}) {
  const site = useSiteStore();

  return useAsyncQuery(PROFILE_QUERY, {
    username,
    includeBoard: site.enableBoards,
    ...query,
  });
}
