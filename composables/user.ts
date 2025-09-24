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
        comments {
          id
          body
          isRemoved
          createdAt
          updatedAt
          voteScore
          userVote
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
