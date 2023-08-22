import { useApubApi } from "@/composables/api";

export async function useFetchUser(username) {
  return useApubApi(`/@${username}`, {
    key: `user_${username}`,
  });
}
