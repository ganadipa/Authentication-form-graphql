import {gql} from 'apollo-server-express';

export const typeDefs = gql`


  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String
    message: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): AuthPayload
    signIn(email: String!, password: String!): AuthPayload
  }
`;
