import gql from "graphql-tag";

export default gql`
  mutation saveComment($commentId: Int!, $save: Boolean!) {
    saveComment(commentId: $commentId, save: $save) {
      id
      isSaved
    }
  }
`;