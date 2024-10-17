import { ref } from "vue";
import { useApi } from "@/composables/api";
import { usePostsStore } from "@/stores/StorePosts";

export async function usePosts(route, listingType) {
  const postsStore = usePostsStore();

  const { data, error } = await postsStore.fetchPosts({
    route,
    listingType,
  });

  postsStore.setPosts(data.value?.listPosts);
  const posts = ref(postsStore.posts);
  const loading = ref(false);

  const queryParams = {
    page: ref(postsStore.options.page),
    limit: postsStore.options.limit,
  };

  const loadMore = async () => {
    loading.value = true;
    postsStore
      .paginate()
      .then((result) => {
        queryParams.page.value = postsStore.options.page;
        postsStore.posts = postsStore.posts.concat(result.data.listPosts);
        posts.value = postsStore.posts;
      })
      .catch(console.error)
      .finally(() => (loading.value = false));
    /*const result = await postsStore.paginate();

    postsStore.posts = postsStore.posts.concat(result.data.listPosts);
    posts.value = postsStore.posts;*/
  };

  return {
    posts,
    error,
    queryParams,
    loadMore,
    loading,
  };
}

// I moved this into listing.js (same folder as this one)

// export async function getListing(query, type_) {
//   // let page = 1;
//   let items = ref([]);
//   let totalCount = ref(0);
//   let endpoints = {
//     posts: "/post/list",
//     comments: "/comment",
//     postsModQueue: "/mod/queue/posts",
//   };
//   async function request(query) {
//     const { data, pending, error, refresh } = await useApi(endpoints[type_], {
//       query: { ...query },
//       key: "get_" + type_ + "_key",
//     });

//     //console.info("console log");

//     //console.log(`data fetched: ${JSON.stringify(data.value.posts, null, 4)}`);
//     if (data.value) {
//       items.value = [...items.value, ...data.value[type_]];
//       totalCount.value = data.value["total_count"];
//     }

//     return {
//       pending,
//       error,
//       refresh,
//     };
//   }

//   async function paginate() {
//     page++;
//     return request(query);
//   }

//   let { pending, error, refresh } = await request(query);

//   return {
//     items,
//     totalCount,
//     paginate,
//     pending,
//     error,
//     refresh,
//   };
// }

export async function getModQueue(query, type_) {
  // let page = 1;
  let items = ref([]);
  let totalCount = ref(0);
  let endpoints = {
    posts: "/mod/queue/posts",
    comments: "/mod/queue/comments",
  };
  async function request(query) {
    const { data, pending, error, refresh } = await useApi(endpoints[type_], {
      query: { ...query },
      key: "get_" + type_ + "_key",
    });

    //console.info("console log");

    //console.log(`data fetched: ${JSON.stringify(data.value.posts, null, 4)}`);
    if (data.value) {
      items.value = [...items.value, ...data.value[type_]];
      totalCount.value = data.value["total_count"];
    }

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
    totalCount,
    paginate,
    pending,
    error,
    refresh,
  };
}
