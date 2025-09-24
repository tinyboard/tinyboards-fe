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
    query UserProfile($username: String!, $includeBoard: Boolean!, $sort: String, $limit: Int, $page: Int) {
      userProfile(username: $username) {
        user {
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
          reputation
        }
        posts {
          id
          title
          content
          url
          isLocked
          isStickied
          isNsfw
          isFeatured
          isRemoved
          createdAt
          updatedAt
          voteScore
          userVote
          board @include(if: $includeBoard) {
            id
            name
            displayName
            description
            icon
            banner
            isNsfw
          }
          author {
            id
            username
            displayName
            avatar
          }
          commentCount
          image
          body
          bodyHtml
        }
        comments {
          id
          content
          isRemoved
          createdAt
          updatedAt
          voteScore
          userVote
          author {
            id
            username
            displayName
            avatar
          }
          depth
          parentId
          childCount
        }
        totalPosts
        totalComments
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
