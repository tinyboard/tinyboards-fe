import { baseURL } from "@/server/constants";

export function useAPI(path, options) {
  const authCookie = useCookie("token").value;

  return useFetch(path, {
    baseURL,
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
    ...options,
  });
}
