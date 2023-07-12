// import { baseURL } from "@/server/constants";

export function useApi(path, options) {
  const authCookie = useCookie("token").value;
  
  console.log(this.$config);

  return useFetch(path, {
    baseURL: `${this.$config.useHTTPS ? "https" : "http"}://${this.$config.domain}/api/v1`,
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
    ...options,
  });
}
