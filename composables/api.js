// import { baseURL } from "@/server/constants";

export function useApi(path, options, headers = {}) {
  const authCookie = useCookie("token").value;
  const config = useRuntimeConfig();
  
  let requestHeaders = {};
  if (headers.hasOwnProperty('Authorization')) {
    requestHeaders = headers;
  } else {
    requestHeaders = {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
      ...headers
    }
  }

  return useFetch(path, {
    baseURL: `${config.public.use_https ? "https" : "http"}://${config.public.domain}/api/v1`,
    headers: requestHeaders,
    ...options,
  });
}
