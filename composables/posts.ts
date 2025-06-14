import { ref, computed } from "vue";
import { usePostsStore } from "@/stores/StorePosts";
import type { Post, ListingType } from "@/types/types";

/**
 * Pagination for post listings.
 * @returns A `ref<boolean>` indicating whether more posts are being loaded, and a function to retrieve
 * more posts.
 */
export function usePagination() {
  const postsStore = usePostsStore();
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
        //console.log(result.data.value);
        postsStore.posts = postsStore.posts.concat(result.data.value.listPosts);
        // posts.value = postsStore.posts;
      })
      .catch(console.error)
      .finally(() => (loading.value = false));
  };

  return { loading, loadMore };
}

/**
 * Load posts into the PostStore. Returns functions to load more posts as well.
 * 
 * Parameters such as sort, limit and page are retrieved from the route query.
 * @param listingType Listing type. See `types.ts` for all available listing types.
 * @returns Function for pagination, and additional data from the fetch response.
 */
export async function usePosts(listingType: ListingType) {
  const postsStore = usePostsStore();

  const { data, error } = await postsStore.fetchPosts({
    // route,
    listingType,
  });

  console.log("getting posts...");
  if (error.value) {
    console.error(JSON.stringify(error, null, 4));
    throw createError({
      statusCode: 500,
      statusMessage: `Error occured while fetching posts: ${JSON.stringify(error, null, 4)}`,
      fatal: true,
    });
  }

  //console.log("data:");
  //console.log(JSON.stringify(data, null, 4));

  postsStore.setPosts(data.value?.listPosts);

  //const posts = ref(postsStore.posts);

  const queryParams = {
    page: ref(postsStore.options.page),
    limit: postsStore.options.limit,
  };

  const hasPosts = computed(() => postsStore.posts.length > 0);

  const { loading, loadMore } = usePagination();

  return {
    //posts,
    hasPosts,
    error: null,
    queryParams,
    loadMore,
    loading,
  };
}

/**
 * Use this when a list of posts is alreday available, but you need to be able to load more for eg. pagination. 
 */
export function usePreloadedPosts(posts: Post[], personId = null) {
  const postsStore = usePostsStore();
  postsStore.setPosts(posts);

  const loading = ref(false);

  if (personId) {
    postsStore.setUserId(personId);
  }

  return usePagination();
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
//     const { data, pending, error, refresh } = await useAPI(endpoints[type_], {
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

// export async function getModQueue(query, type_) {
//   // let page = 1;
//   let items = ref([]);
//   let totalCount = ref(0);
//   let endpoints = {
//     posts: "/mod/queue/posts",
//     comments: "/mod/queue/comments",
//   };
//   async function request(query) {
//     const { data, pending, error, refresh } = await useAPI(endpoints[type_], {
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
