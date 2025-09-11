import gql from "graphql-tag";

export default gql`
  query getMe {
    me {
      id
      name
      displayName
      email
      avatar
      banner
      bio
      signature
      isAdmin
      isDeleted
      isBanned
      creationDate
      updated
      rep
      postCount
      commentCount
      isEmailVerified
      showNSFW
      showBots
      theme
      defaultSortType
      defaultListingType
      interfaceLanguage
      emailNotificationsEnabled
      adminLevel
      profileBackground
      avatarFrame
      bioHTML
      profileMusic
      profileMusicYoutube
      boardCreationApproved
    }
    unreadRepliesCount
    unreadMentionsCount
  }
`;