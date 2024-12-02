import gql from "graphql-tag";

export default gql`
  query getPost(
    $id: Int!,
    $sort: String,
    $topCommentId: Int,
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
        topCommentId: $topCommentId,
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
