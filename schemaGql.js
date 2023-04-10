import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID!): User
    quotes: [QuoteName]
    iquote(by: ID!): [Quote]
    myProfile: User
  }
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    quotes: [Quote]
  }

  type Quote {
    name: String!
    by: ID
  }

  type QuoteName {
    name: String!
    by: IdName
  }

  type IdName {
    _id: String
    firstName: String
  }

  type FindUser {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type foundUser {
    token: String
    findUser: FindUser
  }

  type Mutation {
    signUpUser(userNew: UserInput!): User
    signInUser(userSignIn: UserSignInInput!): foundUser
    createQuote(name: String!): String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserSignInInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
