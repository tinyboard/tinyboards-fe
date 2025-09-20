import { defineStore } from "pinia";
import gql from "graphql-tag";

import { postFragment } from "@/utils/fragments";
import { useBoardStore } from "./StoreBoard";
import { useSiteStore } from "./StoreSite";
import type { GetPostQuery, LoadPostsQuery } from "#gql";
import type { AsyncData } from "#app";
import { type Post, mapToCommentSortType, type ListingType, type SortType, mapToListingType, mapToSortType } from "@/types/types";
//import type { ListingType, SortType } from "#gql/default";

//import POSTS_QUERY from "@/graphql/queries/ListPosts";
//import POST_QUERY from "@/graphql/queries/GetPost";

interface PostsStoreState {
  posts: Post[],
  options: {
    page: number,
    limit: number,
    sort: SortType,
    listingType: ListingType,
    searchQuery: string | null,
    boardId: number | null,
    personId: number | null
  }
}

export const usePostsStore = defineStore("posts", {
  // State
  state: (): PostsStoreState => ({
    posts: [],
    options: {
      page: 1,
      limit: 25,
      sort: mapToSortType("hot"),
      listingType: mapToListingType("local"),
      searchQuery: "",
      boardId: null,
      personId: null
    },
    //paginationFunction: () => {},  
  }),
  getters: {
    getPost(state) {
      return (id: number): Post | undefined => state.posts.find((post: Post) => post.id === id);
    }
  },
  actions: {
    setQueryParams(/*route*/) {
      const route = useRoute();

      const boardStore = useBoardStore();

      /*this.options.page = computed(
        () => !!route.query["page"] ? Number.parseInt(route.query["page"].toString()) : 1
      );
      this.options.limit = computed(
        () => !!route.query["limit"] ? Math.min(Number.parseInt(route.query["limit"].toString()), 100) : 25
      );*/

      this.options.page = !!route?.query?.["page"] ? Number.parseInt(route.query["page"].toString()) : 1;
      this.options.limit = !!route?.query?.["limit"] ? Math.min(Number.parseInt(route.query["limit"].toString()), 100) : 25;

      this.options.boardId = boardStore.hasBoard ? boardStore.board?.id ?? null : null;

      this.options.sort = mapToSortType(route?.params?.["sort"] as string ?? "hot");
    },
    async fetchPosts({ listingType = "local" as ListingType }: { listingType: ListingType }): Promise<AsyncData<GetPostQuery, Error | null>> {
      this.setQueryParams();
      this.options.listingType = listingType;

      return useAsyncGql({
        operation: 'listPosts',
        variables: {
          ...this.options,
          includeBoard: useSiteStore().enableBoards,
        }
      });

      //this.posts = posts;
      //this.paginationFunction = paginationFunction;
    },
    async fetchPost(id: number, {
      sort = "hot",
      context = 0,
      topCommentId = null
    }: {
      sort: string,
      context: number,
      topCommentId?: number | null
    }): Promise<AsyncData<GetPostQuery, Error | null>> {
      return useAsyncGql({
        operation: 'getPost',
        variables: {
          id: Number(id),
          sort: mapToCommentSortType(sort),
          context,
          topCommentId,
          withBoard: useSiteStore().enableBoards
        }
      });
    },
    setPosts(posts: Post[]) {
      this.posts = posts;
    },
    setUserId(id: number) {
      this.options.personId = id;
    },
    extend(posts: Post[]) {
      this.posts.concat(posts);
    },
    async paginate() {
      const pageClone = this.options.page + 1;

      // may the Lord forgive me for doing this but maybe this fixes some really weird bug lmfao
      //delete this.options["page"];
      this.options["page"] = pageClone;
      // I can't believe this shit really works

      //let { clients } = useApollo();

      return useAsyncGql({
        operation: 'listPosts',
        variables: {
          ...this.options,
          includeBoard: useSiteStore().enableBoards,
        },
      });
    },
    clear() {
      this.posts = [];
      this.options.personId = null;
    },
  },
});
