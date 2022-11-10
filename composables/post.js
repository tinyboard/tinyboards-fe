//import { baseURL } from "@/server/constants";
import { useAPI } from "./api";

export async function usePost(id) {
  const {
    data: item,
    pending,
    error,
    refresh,
  } = await useAPI(`/posts/${id}`, {
    key: `post_${id}`,
  });

  return {
    item,
    pending,
    error,
    refresh,
  };
}
