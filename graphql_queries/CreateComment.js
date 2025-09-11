import gql from "graphql-tag";

export default gql`
  mutation createComment(
    $postId: Int!
    $parentId: Int
    $body: String!
  ) {
    createComment(
      postId: $postId
      parentId: $parentId
      body: $body
    ) {
      id
      parentId
      body
      bodyHTML
      isRemoved
      isDeleted
      isLocked
      isPinned
      score
      upvotes
      downvotes
      replyCount
      creationDate
      updated
      myVote
      creator {
        id
        name
        displayName
        avatar
        isAdmin
        instance
      }
      post {
        id
        title
        titleChunk
      }
    }
  }
`;