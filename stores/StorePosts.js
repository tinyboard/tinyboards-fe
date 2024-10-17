import { defineStore } from "pinia";
import gql from "graphql-tag";

import { postFragment } from "@/utils/fragments";

const POSTS_QUERY = gql`
  query loadPosts(
    $listingType: String!
    $sort: String
    $page: Int
    $limit: Int
    $boardId: Int
    $personId: Int
    $includeBoard: Boolean!
  ) {
    listPosts(
      listingType: $listingType
      sort: $sort
      page: $page
      limit: $limit
      boardId: $boardId
      personId: $personId
    ) {
      id
      titleChunk
      title
      url
      bodyHtml
      isRemoved
      isDeleted
      isLocked
      isNSFW
      featuredBoard
      featuredLocal
      score
      myVote
      commentCount
      creationDate
      updated
      creator {
        id
        name
        instance
        adminLevel
        displayName
        avatar
      }
      board @include(if: $includeBoard) {
        id
        name
        title
        icon
        primaryColor
      }
    }
  }
`;

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
      this.options.page = computed(
        () => Number.parseInt(route.query.page) || 1,
      );
      this.options.limit = computed(
        () => Number.parseInt(route.query.limit) || 25,
      );

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

      this.options.sort = sorts.includes(route.params.sort)
        ? route.params.sort
        : "hot";
    },
    async fetchPosts({ route, listingType = "local" }) {
      this.setQueryParams(route);
      this.options.listingType = listingType;

      return useAsyncQuery(POSTS_QUERY, {
        ...this.options,
        includeBoard: this.options.boardId === null,
      });

      //this.posts = posts;
      //this.paginationFunction = paginationFunction;
    },
    setPosts(posts) {
      this.posts = posts;
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

      let { clients } = useApollo();

      return clients.default.query({
        query: POSTS_QUERY,
        variables: {
          ...this.options,
          includeBoard: this.options.boardId === null,
        },
      });
    },
    clear() {
      this.posts = [];
    },
  },
});
