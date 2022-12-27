import { useApi } from "@/composables/api";

export async function useFetchUser(username) {
  return useApi(`/user/${username}`, {
    key: `user_${username}`,
  });
}
