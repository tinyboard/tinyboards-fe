import gql from "graphql-tag";

export default gql`
  query getPost(
    $id: Int!,
    $sort: String,
    $comment: Int,
    $context: Int,
    $search: String,
    $withBoard: Boolean
  ) {
    post(id: $id) {
      id
      title
      titleChunk
      url
      body
      bodyHTML
      score
      upvotes
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
      creator {
        id
        name
        displayName
        avatar
        isAdmin
        instance
        creationDate
        rep
        postCount
        commentCount
      }
      board @include(if: $withBoard) {
        id
        name
        icon
      }
      comments(
        topCommentId: $comment,
        sort: $sort,
        context: $context,
        search: $search
      ) {
        id
        parentId
        bodyHTML
        isRemoved
        isDeleted
        isLocked
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
        board @include(if: $withBoard) {
          id
          name 
          icon
        }
        post {
          id 
          title 
          titleChunk
        }
      }
    }
  }
`;
