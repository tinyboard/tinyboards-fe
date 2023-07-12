// import { baseURL } from "@/server/constants";

export function useApi(path, options) {
  const authCookie = useCookie("token").value;
  
  console.log(this.$config.baseURL);

  return useFetch(path, {
    baseURL: this.$config.baseURL,
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
    ...options,
  });
}
