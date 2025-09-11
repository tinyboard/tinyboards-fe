import gql from "graphql-tag";

export default gql`
  mutation removePost($postId: Int!, $removed: Boolean!, $reason: String) {
    removePost(postId: $postId, removed: $removed, reason: $reason) {
      id
      isRemoved
    }
  }
`;