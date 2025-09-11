import gql from "graphql-tag";

export default gql`
  mutation register(
    $username: String!
    $displayName: String
    $email: String
    $password: String!
    $inviteCode: String
    $applicationAnswer: String
  ) {
    register(
      username: $username
      displayName: $displayName
      email: $email
      password: $password
      inviteCode: $inviteCode
      applicationAnswer: $applicationAnswer
    ) {
      token
      accountCreated
      applicationSubmitted
    }
  }
`;