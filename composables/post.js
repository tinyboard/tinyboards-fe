import { useAPI } from "@/composables/api";
import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { treeComments } from "@/utils/treeComments";
import { ref } from "vue";

export async function usePost(id) {
  const route = useRoute();

  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();

  const sorts = ["hot", "top", "new", "old"];
  const sort = computed(() => {
      return sorts.includes(route.query.sort) ? route.query.sort : "hot";
  });
  const context = route.query.context ? Number(route.query.context) : 0;
  const topCommentId = route.params.comment ? Number(route.params.comment) : null;

  const { data, error } = await postsStore.fetchPost(id, {
    sort,
    context,
    topCommentId
  });

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
    comments: ref(comments),
    error
  };
}

export async function usePostReports(id) {
  const {
    data,
    pending,
    error,
    refresh
  } = await useAPI(`/posts/${id}/reports`, {
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