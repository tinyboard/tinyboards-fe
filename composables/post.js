import { baseURL } from "@/server/constants";

export async function usePost(id) {
  const {
    data: item,
    pending,
    error,
    refresh,
  } = await useFetch(`/posts/${id}`, {
    baseURL,
    key: `post_${id}`,
  });

  return {
    item,
    pending,
    error,
    refresh,
  };
}
