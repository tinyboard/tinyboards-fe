import { useApi } from "@/composables/api";
import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { treeComments } from "@/utils/treeComments";

export async function usePost(id) {
  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();
  const { data, error } = await postsStore.fetchPost(id);

  const _post = data.value?.post;
  let { comments, ...post } = _post;
  //delete _post;

  //delete post.comments;
  comments = comments.map((comment) => ({...comment, replies: []}));

  postsStore.setPosts([post]);
  commentsStore.setComments(comments);
  console.log(comments);

  comments = treeComments(comments);

  //console.log(comments);

  return {
    post,
    comments,
    error
  };
}

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