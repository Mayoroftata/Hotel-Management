import { gql } from "graphql-tag";

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    email: String
    phone: String
  }

  type Query {
    me: User
    getProfile: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
    updateProfile(input: UpdateProfileInput!): User
  }
`;

export default userTypeDefs;
