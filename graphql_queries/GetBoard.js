import gql from "graphql-tag";

export default gql`
  query getBoard($name: String!) {
    boardByName(name: $name) {
      id
      name
      title
      description
      creationDate
      updated
      isDeleted
      isNSFW
      isHidden
      actorId
      local
      lastRefreshedDate
      icon
      banner
      postingRestrictedToMods
      isRemoved
      banReason
      primaryColor
      secondaryColor
      hoverColor
      sidebar
      sidebarHTML
      isBanned
      publicBanReason
      bannedBy
      bannedAt
      excludeFromAll
      subscribers
      posts
      comments
      usersActiveDay
      usersActiveWeek
      usersActiveMonth
      usersActiveHalfYear
      isSubscribed
      isMod
      canCreatePost
    }
  }
`;