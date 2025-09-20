import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { treeComments } from "@/utils/treeComments";
import { ref } from "vue";
import type { Comment, Post } from "@/types/types";
import type { EditPostMutation } from "#gql";

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

  const { data, error } = await postsStore.fetchPost(id, {
    sort,
    context,
    topCommentId
  });

  // Create a computed ref that reacts to changes in data
  const post = computed(() => {
    const postData = data.value?.post;

    if (postData && postData.comments) {
      commentsStore.setComments(postData.comments);
      // organize post comments into a tree
      postData.comments = treeComments(postData.comments);
      postsStore.setPosts([postData]);
    }

    return postData;
  });

  return {
    post,
    error,
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
  return new Promise((resolve, reject) => {
    GqlEditPost({ id, body: newBody })
      .then((editPostResponse: EditPostMutation) => {
        resolve({
          body: editPostResponse.editPost.body,
          bodyHTML: editPostResponse.editPost.bodyHTML
        })
      })
      .catch(reject)
  });
}