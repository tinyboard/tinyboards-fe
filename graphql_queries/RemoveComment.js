import gql from "graphql-tag";

export default gql`
  mutation removeComment($commentId: Int!, $removed: Boolean!, $reason: String) {
    removeComment(commentId: $commentId, removed: $removed, reason: $reason) {
      id
      isRemoved
    }
  }
`;