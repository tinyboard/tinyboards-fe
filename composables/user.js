//import { $fetch } from "ohmyfetch";
//import { useFetch } from "nuxt";
import { useAPI } from "./api";

export async function useFetchUser(username) {
  //const user = await $fetch(`https://jsonplaceholder.typicode.com/users/?username=${username.value}`)
  return useAPI(`/user/${username}`, {
    key: `user_${username}`,
  });
}
