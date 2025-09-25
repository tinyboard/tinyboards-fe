//import { useAPI } from "@/composables/api";
//import PROFILE_QUERY from "@/graphql/queries/UserProfile";
import { useSiteStore } from "@/stores/StoreSite";
import { useGraphQLQuery } from "@/composables/useGraphQL";

/*export async function useFetchUser(username, query = {}) {
  return useAPI(`/user`, {
    key: `user_${username}`,
    query: {
      username,
      ...query
    }
  });
}*/

/**
 * Retrieve a user's profile. 
 * @param username Username of the user.
 * @param query Query parameters, such as post listing sort and limit.
 * @returns A `Promise` of a user profile.
 */
export async function useFetchUser(username: string, query = {}) {
  const site = useSiteStore();

  const query_str = `
    query UserProfile($username: String!, $includeBoard: Boolean!, $limit: Int, $page: Int) {
      user(name: $username) {
        id
        name
        displayName
        avatar
        banner
        profileBackground
        bio
        isAdmin
        isBanned
        creationDate
        postCount
        commentCount
        rep
        posts(sort: hot, limit: $limit, page: $page) {
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
          board @include(if: $includeBoard) {
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
        comments(sort: new, limit: $limit, page: $page) {
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
          level
          parentId
          replyCount
          post {
            id
            title
          }
        }
      }
    }
  `;

  return await useGraphQLQuery(query_str, {
    variables: {
      username,
      includeBoard: site.enableBoards,
      ...query,
    }
  });
}
