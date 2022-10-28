//import { $fetch } from "ohmyfetch";
//import { useFetch } from "nuxt";
import { baseURL } from "@/server/constants";

export async function useFetchUser(username) {
  //const user = await $fetch(`https://jsonplaceholder.typicode.com/users/?username=${username.value}`)
  const data = await useFetch(`/user/${username}`, {
    key: `user_${username}`,
    baseURL,
  });

  return data;
}
