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
    query UserProfile($name: String!, $includeBoard: Boolean!, $limit: Int, $page: Int) {
      user(name: $name) {
        id
        name
        displayName
        avatar
        banner
        profileBackground
        bio
        bioHTML
        isAdmin
        isBanned
        creationDate
        lastSeen
        postCount
        commentCount
        rep
        boardCreationApproved
        flairs {
          id
          userId
          boardId
          templateId
          textDisplay
          backgroundColor
          textColor
          styleConfig
          emojiIds
          isApproved
          creationDate
          assignedBy
          approvedAt
          approvedBy
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
          template {
            id
            textDisplay
            textEditable
            backgroundColor
            textColor
            styleConfig
            emojiIds
          }
        }
        posts(sort: hot, limit: $limit, page: $page) {
          id
          title
          slug
          titleChunk
          postType
          urlPath
          url
          isLocked
          isNSFW
          isRemoved
          creationDate
          score
          myVote
          creator {
            id
            name
            displayName
            avatar
            isAdmin
          }
          board @include(if: $includeBoard) {
            id
            name
            icon
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
                shadowBlur
                shadowOffsetX
                shadowOffsetY
              }
            }
          }
          commentCount
          image
        }
        comments(sort: new, limit: $limit, page: $page) {
          id
          body
          creationDate
          score
          myVote
          post {
            id
            title
            slug
            titleChunk
            postType
            urlPath
            board @include(if: $includeBoard) {
              id
              name
            }
          }
        }
      }
    }
  `;

  const result = await useGraphQLQuery(query_str, {
    variables: {
      name: username,
      includeBoard: site.enableBoards,
      ...query,
    }
  });

  return result;
}
