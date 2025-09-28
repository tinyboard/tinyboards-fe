import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { treeComments } from "@/utils/treeComments";
import { useGraphQLMutation } from "@/composables/useGraphQL";
import { ref, computed, watch } from "vue";
import type { Comment, Post } from "@/types/types";

/**
 * Retrieve a post from the backend, and organize its comments into a tree stucture.
 * Comment sort, context and top comment ID are retrieved from the route. 
 * @param id ID of the post to fetch.
 * @returns A `Promise` with either a `Post` object or a server error.
 */
export async function usePost(id: number): Promise<{
  post: any;
  error: any;
}> {
  const route = useRoute();

  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();

  //const sorts = ["hot", "top", "new", "old"];
  const sort = route.query.sort?.toString() ?? "hot";
  const context = route.query.context ? Number(route.query.context) : 0;
  const topCommentId = route.params?.comment ? Number(route.params?.comment) : null;

  const { data, error, pending } = await postsStore.fetchPost(id, {
    sort,
    context,
    topCommentId
  });

  // Create a computed that handles the data properly
  const post = computed(() => {
    try {
      let postData = data.value?.post;

      // Debug logging
      if (process.dev) {
        console.log('usePost computed - raw data.value:', data.value);
        console.log('usePost computed - postData from data.value?.post:', postData);
      }

      // Fallback: maybe the response structure is different
      if (!postData && data.value) {
        // Try direct access in case the response is just the post data
        if (data.value.id) {
          postData = data.value;
          if (process.dev) {
            console.log('usePost computed - using direct data.value as postData:', postData);
          }
        }
        // Try other possible structures
        else if (data.value.data?.post) {
          postData = data.value.data.post;
          if (process.dev) {
            console.log('usePost computed - using data.value.data.post as postData:', postData);
          }
        }
      }

      if (postData && postData.comments) {
        commentsStore.setComments(postData.comments);
        // organize post comments into a tree
        postData.comments = treeComments(postData.comments);
        postsStore.setPosts([postData]);
      }

      if (process.dev) {
        console.log('usePost computed - final postData:', postData);
      }

      return postData;
    } catch (error) {
      if (process.dev) {
        console.error('Error in usePost computed:', error);
      }
      return null;
    }
  });

  return {
    post,
    error,
    pending,
    data  // Also return the raw data for debugging
  };
}


// export async function editPost(id: number, newBody: string) {
//   return GqlEditPost({ id, body: newBody });
// }

/**
 * Submit a request to edit a post's body.
 * @param id ID of the post to edit
 * @param newBody The new post body
 * @returns A `Promise` that resolves to an object containing the new `body` and `bodyHTML` if the request was successful.
 */
export async function editPost(id: number, newBody: string): Promise<{
  body: string;
  bodyHTML: string;
}> {
  try {
    const mutation = `
      mutation EditPost($id: Int!, $body: String!) {
        editPost(id: $id, body: $body) {
          body
          bodyHTML
        }
      }
    `;

    const { data } = await useGraphQLMutation(mutation, {
      id,
      body: newBody
    });

    if (data.value?.editPost) {
      return {
        body: data.value.editPost.body,
        bodyHTML: data.value.editPost.bodyHTML
      };
    }

    throw new Error('No data returned from editPost mutation');
  } catch (error) {
    throw error;
  }
}