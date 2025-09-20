import { ref } from "vue";

import { useAPI } from "@/composables/api";
import type { EditCommentMutation } from "#gql";

export async function usePostComments(id, query = {}) {
  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useAPI("/comments", {
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
  const url = type === "post" ? "/comments" : `/comments/${id}`;

  const {
    data: listing,
    pending,
    error,
    refresh,
  } = await useAPI(url, {
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

/**
 * Submit a request to edit a comment's body.
 * @param id ID of the comment to edit
 * @param newBody The new comment body
 * @returns A Promise that resolves to the updated comment data if successful
 */
export async function editComment(id: number, newBody: string): Promise<{
  body: string;
  bodyHTML: string;
}> {
  return new Promise((resolve, reject) => {
    GqlEditComment({ id, body: newBody })
      .then((editCommentResponse: EditCommentMutation) => {
        resolve({
          body: editCommentResponse.editComment.body,
          bodyHTML: editCommentResponse.editComment.bodyHTML
        })
      })
      .catch(reject)
  });
}
