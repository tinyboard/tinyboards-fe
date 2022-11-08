import { baseURL } from "@/server/constants";
import { ref } from "vue";

export async function usePostComments(id, query = {}) {
  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useFetch("/comments", {
    query: { ...query, post_id: id },
    baseURL,
    key: `post_${id}_comments`,
  });

  let comments = ref([]);
  if (!error.value) {
    comments.value = listing.value.comments;
  }

  return {
    comments,
    commentsPending: pending,
    commentsError: error,
    commentsRefresh: refresh,
  };
}
