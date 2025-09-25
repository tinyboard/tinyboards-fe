import { ref } from "vue";
import { useGraphQLQuery, useGraphQLMutation } from "@/composables/useGraphQL";
import { useAPI } from "@/composables/api";

export async function usePostComments(id, query = {}) {
  const query_str = `
    query ListComments($postId: Int!, $sort: CommentSortType, $limit: Int, $page: Int) {
      listComments(postId: $postId, sort: $sort, limit: $limit, page: $page) {
        id
        body
        isRemoved
        creationDate
        updated
        score
        myVote
        creator {
          id
          name
          displayName
          avatar
        }
        level
        parentId
        replyCount
        post {
          id
          title
        }
      }
    }
  `;

  const result = await useGraphQLQuery(query_str, {
    variables: {
      postId: id,
      ...query
    }
  });

  const { data: listing, error } = result;
  const pending = ref(false);
  const refresh = () => Promise.resolve();

  let comments = ref([]);
  if (!error.value && listing.value?.listComments) {
    comments.value = listing.value.listComments;
  }

  return {
    comments,
    commentsPending: pending,
    commentsError: error,
    commentsRefresh: refresh,
  };
}

export async function useComments(id, type = "post", query = {}, post_id) {
  const variables = type === "post"
    ? { postId: id, ...query }
    : { commentId: id, postId: post_id, ...query };

  const query_str = `
    query ListComments($postId: Int, $commentId: Int, $sort: CommentSortType, $limit: Int, $page: Int) {
      listComments(postId: $postId, commentId: $commentId, sort: $sort, limit: $limit, page: $page) {
        id
        body
        isRemoved
        creationDate
        updated
        score
        myVote
        creator {
          id
          name
          displayName
          avatar
        }
        level
        parentId
        replyCount
        post {
          id
          title
        }
      }
    }
  `;

  const result = await useGraphQLQuery(query_str, {
    variables
  });

  const { data: listing, error } = result;
  const pending = ref(false);
  const refresh = () => Promise.resolve();

  let comments = ref([]);
  if (!error.value && listing.value?.listComments) {
    comments.value = listing.value.listComments;
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
  try {
    const mutation = `
      mutation EditComment($id: Int!, $body: String!) {
        editComment(id: $id, body: $body) {
          body
          bodyHTML
        }
      }
    `;

    const { data } = await useGraphQLMutation(mutation, {
      variables: {
        id,
        body: newBody
      }
    });

    if (data.value?.editComment) {
      return {
        body: data.value.editComment.body,
        bodyHTML: data.value.editComment.bodyHTML
      };
    }

    throw new Error('No data returned from editComment mutation');
  } catch (error) {
    throw error;
  }
}
