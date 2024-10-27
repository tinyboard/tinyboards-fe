import gql from "graphql-tag";

export default gql`
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
      bodyHTML
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
      myModPermissions
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
