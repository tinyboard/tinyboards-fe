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

export async function useFetchUser(username, query = {}) {
  const site = useSiteStore();

  return useAsyncGql({
    operation: 'userProfile', 
    variables: {
      username,
      includeBoard: site.enableBoards,
      ...query,
    }});
}
