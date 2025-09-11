import gql from "graphql-tag";

export default gql`
  mutation login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      token
    }
  }
`;