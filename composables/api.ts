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

// Network error handler
function handleNetworkError(error: any) {
  if (process.dev) {
    console.error('Network error:', error);
  }

  // Check for specific error types
  if (error.name === 'AbortError') {
    throw new Error('Request was cancelled');
  }

  if (error.cause?.code === 'ECONNREFUSED') {
    throw new Error('Cannot connect to server. Please check if the backend is running.');
  }

  if (error.cause?.code === 'ENOTFOUND') {
    throw new Error('Server not found. Please check your network connection.');
  }

  // Generic network error
  throw new Error('Network error occurred. Please try again.');
}
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

  try {
    return useFetch(path, {
      baseURL: `${config.public.use_https ? "https" : "http"}://${config.public.domain}/api/v${apiVersion}`,
      headers: requestHeaders,
      timeout: options.timeout || 30000, // 30 second default timeout
      retry: options.retry !== undefined ? options.retry : 2, // Default 2 retries
      onRequestError({ error }) {
        handleNetworkError(error);
      },
      onResponseError({ response }) {
        if (process.dev) {
          console.error('Response error:', response.status, response.statusText);
        }

        // Handle specific HTTP status codes
        if (response.status === 401) {
          // Clear invalid token
          const tokenCookie = useCookie('token');
          tokenCookie.value = null;
          throw new Error('Authentication required. Please log in again.');
        }

        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to perform this action.');
        }

        if (response.status === 404) {
          throw new Error('Resource not found.');
        }

        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      },
      ...options,
    });
  } catch (error) {
    handleNetworkError(error);
  }
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
