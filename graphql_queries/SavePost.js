import gql from "graphql-tag";

export default gql`
  mutation savePost($postId: Int!, $save: Boolean!) {
    savePost(postId: $postId, save: $save) {
      id
      isSaved
    }
  }
`;