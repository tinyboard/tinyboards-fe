import { useApi } from "@/composables/api";

export async function usePost(id) {
  const {
    data: item,
    pending,
    error,
    refresh,
  } = await useApi(`/post/${id}`, {
    key: `post_${id}`,
  });

  return {
    item,
    pending,
    error,
    refresh,
  };
};