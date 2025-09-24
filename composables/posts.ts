import { ref, computed } from "vue";
import { usePostsStore } from "@/stores/StorePosts";
import { useAPI } from "@/composables/api";
import { useGraphQLQuery } from "@/composables/useGraphQL";
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
      .catch((err) => { if (process.dev) console.error(err); })
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

  let data, error;

  try {
    const result = await postsStore.fetchPosts({
      // route,
      listingType,
    });
    data = result.data;
    error = result.error;
  } catch (gqlError) {
    if (process.dev) console.error("Caught GraphQL error:", gqlError);

    // Check if this is a GraphQL error with private instance message
    const gqlErrorMessages = gqlError?.gqlErrors?.map(err => err.message).join(' ') || '';
    const errorMessage = gqlError?.message || '';

    const isPrivateInstanceError = gqlErrorMessages.includes('private instance') ||
                                   gqlErrorMessages.includes('You need an account') ||
                                   errorMessage.includes('private instance') ||
                                   errorMessage.includes('You need an account');

    if (isPrivateInstanceError) {
      // Handle private instance gracefully - set empty posts and continue
      postsStore.setPosts([]);

      const queryParams = {
        page: ref(postsStore.options.page),
        limit: postsStore.options.limit,
      };

      const hasPosts = computed(() => false);
      const { loading, loadMore } = usePagination();

      return {
        hasPosts,
        error: { isPrivateInstance: true, message: gqlErrorMessages || errorMessage },
        queryParams,
        loadMore,
        loading,
      };
    }

    // Re-throw if not a private instance error
    throw gqlError;
  }

  if (process.dev) console.log("getting posts...");
  if (error.value) {
    if (process.dev) console.error(error.value);

    // Check if this is a private instance error - don't make it fatal
    // The actual GraphQL error is in the cause property
    const errorCause = error.value?.cause || error.value;
    const errorMessage = error.value?.message || '';
    const gqlErrors = errorCause?.gqlErrors || error.value?.gqlErrors || [];
    const gqlErrorMessages = gqlErrors.map(err => err.message).join(' ');

    // First check gqlErrors as they are more reliable for GraphQL errors
    const isPrivateInstanceError = gqlErrorMessages.includes('private instance') ||
                                   gqlErrorMessages.includes('You need an account') ||
                                   errorMessage.includes('private instance') ||
                                   errorMessage.includes('You need an account');

    if (isPrivateInstanceError) {
      // Handle private instance gracefully - set empty posts and continue
      postsStore.setPosts([]);

      const queryParams = {
        page: ref(postsStore.options.page),
        limit: postsStore.options.limit,
      };

      const hasPosts = computed(() => false);
      const { loading, loadMore } = usePagination();

      return {
        hasPosts,
        error: { isPrivateInstance: true, message: gqlErrorMessages || errorMessage },
        queryParams,
        loadMore,
        loading,
      };
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Error occured while fetching posts: ${error.value?.message || 'Unknown error'}`,
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
export function usePreloadedPosts(posts: Post[], userId = null) {
  const postsStore = usePostsStore();
  postsStore.setPosts(posts);

  const loading = ref(false);

  if (userId) {
    postsStore.setUserId(userId);
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

export async function getModQueue(query: any, type_: string) {
  let items = ref([]);
  let totalCount = ref(0);

  async function request(query: any) {
    const query_str = `
      query GetModerationQueue($limit: Int!, $page: Int!, $type: String!) {
        getModerationQueue(limit: $limit, page: $page, type: $type) {
          totalCount
          posts {
            id
            title
            body
            url
            isLocked
            featuredBoard
            isNSFW
            featuredLocal
            isRemoved
            creationDate
            updated
            score
            myVote
            board {
              id
              name
              title
              description
              icon
              banner
              isNSFW
            }
            creator {
              id
              name
              displayName
              avatar
            }
            commentCount
            image
            body
            bodyHTML
          }
          comments {
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
            depth
            parentId
            childCount
          }
        }
      }
    `;

    const result = await useGraphQLQuery(query_str, {
      variables: {
        limit: query.limit || 25,
        page: query.page || 1,
        type: type_
      }
    });

    const { data, error } = result;
    const pending = ref(false);
    const refresh = () => Promise.resolve();

    if (data.value?.getModerationQueue) {
      const queueData = data.value.getModerationQueue;
      if (type_ === 'posts' && queueData.posts) {
        items.value = [...items.value, ...queueData.posts];
      } else if (type_ === 'comments' && queueData.comments) {
        items.value = [...items.value, ...queueData.comments];
      }
      totalCount.value = queueData.totalCount || 0;
    }

    return {
      pending,
      error,
      refresh,
    };
  }

  async function paginate() {
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
