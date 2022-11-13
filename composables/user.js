//import { $fetch } from "ohmyfetch";
//import { useFetch } from "nuxt";
import { useApi } from "@/composables/api";

export async function useFetchUser(username) {
  //const user = await $fetch(`https://jsonplaceholder.typicode.com/users/?username=${username.value}`)
  return useApi(`/user/${username}`, {
    key: `user_${username}`,
  });
}
