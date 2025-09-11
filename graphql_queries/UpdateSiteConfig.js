import gql from "graphql-tag";

export default gql`
  mutation updateSiteConfig($input: UpdateSiteConfigInput!) {
    updateSiteConfig(input: $input) {
      id
      name
      description
      icon
      primaryColor
      secondaryColor
      hoverColor
      enableDownvotes
      enableNSFW
      boardCreationAdminOnly
      requireEmailVerification
      requireApplication
      applicationQuestion
      privateInstance
      inviteOnly
      openRegistration
      registrationMode
      defaultTheme
      defaultPostListingType
      defaultAvatar
      legalInformation
      hideModlogModNames
      applicationEmailAdmins
      actorNameMaxLength
      federationEnabled
      federationDebug
      federationStrictAllowlist
      federationHttpFetchRetryLimit
      federationWorkerCount
      captchaEnabled
      captchaDifficulty
      reportsEmailAdmins
      welcomeMessage
      boardsEnabled
      boardCreationMode
      trustedUserMinReputation
      trustedUserMinAccountAgeDays
      trustedUserManualApproval
      trustedUserMinPosts
      allowedPostTypes
      enableNSFWTagging
      wordFilterEnabled
      filteredWords
      wordFilterAppliesToPosts
      wordFilterAppliesToComments
      wordFilterAppliesToUsernames
      linkFilterEnabled
      bannedDomains
      approvedImageHosts
      imageEmbedHostsOnly
    }
  }
`;