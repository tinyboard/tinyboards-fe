import { ref } from "vue";

import { useApi } from "@/composables/api";

export async function usePostComments(id, query = {}) {
  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useApi("/comment/list", {
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

export async function useComments(id, type = "post", query = {}, post_id) {
  const url = type === "post" ? "/comment/list" : `/comment/${id}`;

  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useApi(url, {
    query: {
      ...query,
      ...(type === "post" && { post_id: id }),
      ...(type === "comment" && { post: post_id }),
    },
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
