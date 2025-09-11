import gql from "graphql-tag";

export default gql`
  mutation voteComment($commentId: Int!, $score: Int!) {
    voteComment(commentId: $commentId, score: $score) {
      id
      score
      upvotes
      downvotes
      myVote
    }
  }
`;