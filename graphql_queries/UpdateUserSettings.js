import gql from "graphql-tag";

export default gql`
  mutation updateUserSettings($input: UpdateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      id
      name
      displayName
      email
      avatar
      banner
      bio
      signature
      showNSFW
      showBots
      theme
      defaultSortType
      defaultListingType
      interfaceLanguage
      emailNotificationsEnabled
      profileBackground
      avatarFrame
      bioHTML
      profileMusic
      profileMusicYoutube
    }
  }
`;