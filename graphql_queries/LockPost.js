import gql from "graphql-tag";

export default gql`
  mutation lockPost($postId: Int!, $locked: Boolean!) {
    lockPost(postId: $postId, locked: $locked) {
      id
      isLocked
    }
  }
`;