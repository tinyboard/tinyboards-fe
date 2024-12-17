// import { baseURL } from "@/server/constants";

export function useAPI(path, options = {}, headers = {}) {
  const authCookie = useCookie("token").value;
  const config = useRuntimeConfig();
  const apiVersion = options.version ?? 1;
  
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
    baseURL: `${config.public.use_https ? "https" : "http"}://${config.public.domain}/api/v${apiVersion}`,
    headers: requestHeaders,
    ...options,
  });
}

export function useApubApi(path, options, headers = {}) {
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
    baseURL: `${config.public.use_https ? "https" : "http"}://${config.public.domain}`,
    headers: requestHeaders,
    ...options,
  });
}
