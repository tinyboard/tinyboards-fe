import { defineStore } from "pinia";
import { useGraphQLQuery } from "@/composables/useGraphQL";
import { useBoardStore } from "./StoreBoard";
import { useSiteStore } from "./StoreSite";
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
    boardId: number | null,
    userId: number | null
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
      boardId: null,
      userId: null
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
    async fetchPosts({ listingType = "local" as ListingType }: { listingType: ListingType }) {
      this.setQueryParams();
      this.options.listingType = listingType;

      const query = `
        query ListPosts($page: Int!, $limit: Int!, $sort: SortType!, $listingType: ListingType!, $boardId: Int, $userId: Int, $includeBoard: Boolean!) {
          listPosts(page: $page, limit: $limit, sort: $sort, listingType: $listingType, boardId: $boardId, userId: $userId) {
            id
            title
            titleChunk
            slug
            urlPath
            url
            isLocked
            featuredBoard
            isNSFW
            featuredLocal
            isRemoved
            creationDate
            updated
            score
            upvotes
            downvotes
            myVote
            creatorVote
            board @include(if: $includeBoard) {
              id
              name
              title
              description
              icon
              banner
              isNSFW
              subscribedType
            }
            creator {
              id
              name
              displayName
              avatar
              adminLevel
              postCount
              commentCount
              rep
              creationDate
            }
            commentCount
            image
            body
            bodyHTML
            participants {
              id
              name
              displayName
              avatar
            }
            flairs {
              id
              templateId
              textDisplay
              backgroundColor
              textColor
              template {
                id
                textDisplay
                textEditable
                backgroundColor
                textColor
                styleConfig
                emojiIds
                style {
                  backgroundColor
                  textColor
                  borderColor
                  borderWidth
                  borderRadius
                  borderStyle
                  fontWeight
                  fontSize
                  padding
                  margin
                  customCss
                  shadowColor
                  shadowOffsetX
                  shadowOffsetY
                  shadowBlur
                  animationType
                  animationDuration
                  gradientStart
                  gradientEnd
                  gradientDirection
                }
              }
            }
          }
        }
      `;

      return await useGraphQLQuery(query, {
        variables: {
          ...this.options,
          includeBoard: useSiteStore().enableBoards,
        }
      });
    },
    async fetchPost(id: number, {
      sort = "hot",
      context = 0,
      topCommentId = null
    }: {
      sort: string,
      context: number,
      topCommentId?: number | null
    }) {
      const query = `
        query GetPost($id: Int!, $sort: CommentSortType, $context: Int, $topCommentId: Int, $withBoard: Boolean!) {
          post(id: $id) {
            id
            title
            titleChunk
            slug
            urlPath
            url
            isLocked
            featuredBoard
            isNSFW
            featuredLocal
            isRemoved
            creationDate
            updated
            score
            upvotes
            downvotes
            myVote
            creatorVote
            board @include(if: $withBoard) {
              id
              name
              title
              description
              icon
              banner
              primaryColor
              secondaryColor
              hoverColor
              isNSFW
              subscribedType
              creationDate
            }
            creator {
              id
              name
              displayName
              avatar
              adminLevel
              postCount
              commentCount
              rep
              creationDate
            }
            commentCount
            image
            body
            bodyHTML
            participants {
              id
              name
              displayName
              avatar
            }
            flairs {
              id
              templateId
              textDisplay
              backgroundColor
              textColor
              template {
                id
                textDisplay
                textEditable
                backgroundColor
                textColor
                styleConfig
                emojiIds
                style {
                  backgroundColor
                  textColor
                  borderColor
                  borderWidth
                  borderRadius
                  borderStyle
                  fontWeight
                  fontSize
                  padding
                  margin
                  customCss
                  shadowColor
                  shadowOffsetX
                  shadowOffsetY
                  shadowBlur
                  animationType
                  animationDuration
                  gradientStart
                  gradientEnd
                  gradientDirection
                }
              }
            }
            comments(sort: $sort, context: $context, topCommentId: $topCommentId) {
              id
              body
              bodyHTML
              isRemoved
              creationDate
              updated
              score
              myVote
              creatorVote
              creator {
                id
                name
                displayName
                avatar
                postCount
                commentCount
                rep
                flairs {
                  id
                  templateId
                  textDisplay
                  backgroundColor
                  textColor
                  template {
                    id
                    textDisplay
                    textEditable
                    backgroundColor
                    textColor
                    styleConfig
                    emojiIds
                    style {
                      backgroundColor
                      textColor
                      borderColor
                      borderWidth
                      borderRadius
                      fontWeight
                      fontSize
                      padding
                      margin
                      customCss
                    }
                  }
                }
              }
              board {
                id
                name
              }
              level
              parentId
              replyCount
            }
          }
        }
      `;

      const result = await useGraphQLQuery(query, {
        variables: {
          id: Number(id),
          sort: mapToCommentSortType(sort),
          context,
          topCommentId,
          withBoard: useSiteStore().enableBoards
        }
      });


      return result;
    },
    setPosts(posts: Post[]) {
      this.posts = posts;
    },
    setUserId(id: number) {
      this.options.userId = id;
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

      const query = `
        query ListPosts($page: Int!, $limit: Int!, $sort: SortType!, $listingType: ListingType!, $boardId: Int, $userId: Int, $includeBoard: Boolean!) {
          listPosts(page: $page, limit: $limit, sort: $sort, listingType: $listingType, boardId: $boardId, userId: $userId) {
            id
            title
            titleChunk
            slug
            urlPath
            url
            isLocked
            featuredBoard
            isNSFW
            featuredLocal
            isRemoved
            creationDate
            updated
            score
            upvotes
            downvotes
            myVote
            creatorVote
            board @include(if: $includeBoard) {
              id
              name
              title
              description
              icon
              banner
              isNSFW
              subscribedType
            }
            creator {
              id
              name
              displayName
              avatar
              adminLevel
              postCount
              commentCount
              rep
              creationDate
            }
            commentCount
            image
            body
            bodyHTML
            participants {
              id
              name
              displayName
              avatar
            }
            flairs {
              id
              templateId
              textDisplay
              backgroundColor
              textColor
              template {
                id
                textDisplay
                textEditable
                backgroundColor
                textColor
                styleConfig
                emojiIds
                style {
                  backgroundColor
                  textColor
                  borderColor
                  borderWidth
                  borderRadius
                  borderStyle
                  fontWeight
                  fontSize
                  padding
                  margin
                  customCss
                  shadowColor
                  shadowOffsetX
                  shadowOffsetY
                  shadowBlur
                  animationType
                  animationDuration
                  gradientStart
                  gradientEnd
                  gradientDirection
                }
              }
            }
          }
        }
      `;

      return await useGraphQLQuery(query, {
        variables: {
          ...this.options,
          includeBoard: useSiteStore().enableBoards,
        }
      });
    },
    clear() {
      this.posts = [];
      this.options.userId = null;
    },
  },
});
