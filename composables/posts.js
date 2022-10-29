import { baseURL } from "@/server/constants";
import { ref } from "vue";

export async function getListing(query, type_) {
  let page = 1;
  let posts = ref([]);
  let endpoints = {
    posts: "/post/list",
    comments: "/comment/list"
  }
  async function request(query) {

    const { data, pending, error, refresh } = await useFetch(endpoints[type_], {
      query: { ...query, page },
      baseURL,
      key: "get_" + type_ + "_key",
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
