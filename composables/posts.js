import { baseURL } from "@/server/constants";
import { ref } from "vue";

export async function usePosts(query) {
  let page = 1;
  let posts = ref([]);

  async function request(query) {
    const { data, pending, error, refresh } = await useFetch("/post/list", {
      query: { ...query, page },
      baseURL,
      key: "get_posts_key",
    });

    console.info("console log");

    console.log(`data fetched: ${JSON.stringify(data.value.posts, null, 4)}`);
    posts.value = [...posts.value, ...data.value.posts];

    return {
      pending,
      error,
      refresh,
    };
  }

  async function paginate() {
    page++;
    return request(query);
  }

  let { pending, error, refresh } = request(query);

  return {
    posts,
    paginate,
    pending,
    error,
    refresh,
  };
}
