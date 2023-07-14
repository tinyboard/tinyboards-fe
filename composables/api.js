// import { baseURL } from "@/server/constants";

export function useApi(path, options) {
  const authCookie = useCookie("token").value;
  const config = useRuntimeConfig();
  
  console.log(config);

  return useFetch(path, {
    baseURL: `${config.public.useHTTPS ? "https" : "http"}://${config.public.domain}/api/v1`,
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
    ...options,
  });
}
