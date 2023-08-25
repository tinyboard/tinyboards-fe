import { useApi } from "@/composables/api";

export async function useFetchUser(username, query = {}) {
  return useApi(`/user`, {
    key: `user_${username}`,
    query: {
      username,
      ...query
    }
  });
}
