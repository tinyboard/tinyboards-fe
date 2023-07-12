// import { baseURL } from "@/server/constants";

export function useApi(path, options) {
  const authCookie = useCookie("token").value;
  const config = useRuntimeConfig();

  return useFetch(path, {
    baseURL: `${config.USE_HTTPS ? "https" : "http"}://${config.DOMAIN}/api/v1`,
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
    ...options,
  });
}
