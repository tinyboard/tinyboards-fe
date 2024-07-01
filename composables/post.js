import { useApi } from "@/composables/api";

export async function usePost(id) {
  const {
    data: item,
    pending,
    error,
    refresh,
  } = await useApi(`/posts/${id}`, {
    key: `post_${id}`,
  });

  return {
    item,
    pending,
    error,
    refresh,
  };
};

export async function usePostReports(id) {
  const {
    data,
    pending,
    error,
    refresh
  } = await useApi(`/posts/${id}/reports`, {
    query: {
      //post_id: id,
      unresolved_only: true
    }
  });

  return {
    data,
    pending,
    error,
    refresh
  };
};