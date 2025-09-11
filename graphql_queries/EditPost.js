import gql from "graphql-tag";

export default gql`
  mutation editPost(
    $postId: Int!
    $title: String
    $body: String
    $url: String
    $nsfw: Boolean
  ) {
    editPost(
      postId: $postId
      title: $title
      body: $body
      url: $url
      nsfw: $nsfw
    ) {
      id
      title
      titleChunk
      url
      body
      bodyHTML
      score
      upvotes
      downvotes
      isNSFW
      isRemoved
      isDeleted
      isLocked
      creationDate
      updated
      isSaved
      myVote
      featuredLocal
      featuredBoard
      commentCount
    }
  }
`;