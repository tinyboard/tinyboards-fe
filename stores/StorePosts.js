import { defineStore } from "pinia";
import gql from "graphql-tag";

import { postFragment } from "@/utils/fragments";
import { useBoardStore } from "./StoreBoard";
import { useSiteStore } from "./StoreSite";

//import POSTS_QUERY from "@/graphql/queries/ListPosts";
//import POST_QUERY from "@/graphql/queries/GetPost";

export const usePostsStore = defineStore("posts", {
  // State
  id: "posts",
  state: () => {
    return {
      posts: [],
      options: {
        page: 1,
        limit: 25,
        sort: "hot",
        listingType: "local",
        searchQuery: "",
        boardId: null,
        personId: null,
      },
      //paginationFunction: () => {},
    };
  },
  actions: {
    setQueryParams(route) {
      const boardStore = useBoardStore();

      this.options.page = computed(
        () => Number.parseInt(route.query.page) || 1,
      );
      this.options.limit = computed(
        () => Number.parseInt(route.query.limit) || 25,
      );

      this.options.boardId = boardStore.hasBoard ? boardStore.board.id : null;

      const sorts = [
        "hot",
        "new",
        "topAll",
        "topMonth",
        "topWeek",
        "topDay",
        "mostComments",
        "newComments",
      ];

      if (route.params.hasOwnProperty("sort")) {
        this.options.sort = sorts.includes(route.params.sort)
          ? route.params.sort
          : "hot";
      } else {
        this.options.sort = sorts.includes(route.query.sort)
          ? route.params.sort
          : "hot";
      }
    },
    async fetchPosts({ route, listingType = "local" }) {
      this.setQueryParams(route);
      this.options.listingType = listingType;

      return useAsyncGql({
        operation: 'loadPosts',
        variables: {
          ...this.options,
          includeBoard: useSiteStore().enableBoards,
        }
      });

      //this.posts = posts;
      //this.paginationFunction = paginationFunction;
    },
    async fetchPost(id, { sort = "hot", context = 0, topCommentId = null }) {
      return useAsyncGql({operation: 'getPost', variables: { id: Number(id), sort, context, topCommentId, withBoard: useSiteStore().enableBoards }});
    },
    setPosts(posts) {
      this.posts = posts;
    },
    setUserId(id) {
      this.options.personId = id;
    },
    extend(posts) {
      this.posts.concat(posts);
    },
    async paginate() {
      const pageClone = this.options.page + 1;

      // may the Lord forgive me for doing this but maybe this fixes some really weird bug lmfao
      delete this.options["page"];
      this.options["page"] = pageClone;
      // I can't believe this shit really works

      //let { clients } = useApollo();

      return useAsyncGql({
        operation: 'loadPosts',
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
