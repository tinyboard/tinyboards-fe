import { ref } from "vue";

import { useApi } from "@/composables/api";

export async function usePostComments(id, query = {}) {
  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useApi("/comments", {
    query: { ...query, post_id: id },
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

export async function useComments(id, type = 'post', query = {}) {
  type = type === 'post' ? 'post_id' : 'comment_id';

  console.log(type)

  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useApi(`/comments?${type}=${id}`, {
    query: { ...query },
    key: `${type}_${id}_comments`,
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
