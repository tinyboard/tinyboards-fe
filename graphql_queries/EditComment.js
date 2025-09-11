import gql from "graphql-tag";

export default gql`
  mutation editComment(
    $commentId: Int!
    $body: String!
  ) {
    editComment(
      commentId: $commentId
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
    }
  }
`;