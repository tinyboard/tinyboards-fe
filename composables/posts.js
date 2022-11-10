import { baseURL } from "@/server/constants";
import { ref } from "vue";
import { useAPI } from "./api";

export async function getListing(query, type_) {
  let page = 1;
  let items = ref([]);
  let endpoints = {
    posts: "/posts",
    comments: "/comment",
  };
  async function request(query) {
    const { data, pending, error, refresh } = await useAPI(endpoints[type_], {
      query: { ...query, page },
      key: "get_" + type_ + "_key",
    });

    //console.info("console log");

    //console.log(`data fetched: ${JSON.stringify(data.value.posts, null, 4)}`);
    items.value = [...items.value, ...data.value[type_]];

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

  let { pending, error, refresh } = await request(query);

  return {
    items,
    paginate,
    pending,
    error,
    refresh,
  };
}
