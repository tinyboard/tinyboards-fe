// import { baseURL } from "@/server/constants";

// TODO: rewrite according to the Nuxt guide for custom fetch: https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch

/**
 * A wrapper for `useFetch` to perform an authenticated request to the backend.
 * 
 * @param path Relative path **to the API base URL** (`https://{domain}/api/v{apiVersion}`)
 * @param options Options passed to `useFetch`. [useFetch documentation](https://nuxt.com/docs/api/composables/use-fetch)
 * @param headers Request headers. Will be extended with the `Authorization` header if the user is logged in.
 * @returns An AsyncData object.
 */
export function useAPI(
    path: string,
    options: { [key: string]: any } = {},
    headers: { [key: string]: string } = {})
  {
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

// export function useApubApi(path, options, headers = {}) {
//   const authCookie = useCookie("token").value;
//   const config = useRuntimeConfig();
  
//   let requestHeaders = {};
//   if (headers.hasOwnProperty('Authorization')) {
//     requestHeaders = headers;
//   } else {
//     requestHeaders = {
//       Authorization: authCookie ? `Bearer ${authCookie}` : "",
//       ...headers
//     }
//   }

//   return useFetch(path, {
//     baseURL: `${config.public.use_https ? "https" : "http"}://${config.public.domain}`,
//     headers: requestHeaders,
//     ...options,
//   });
// }
