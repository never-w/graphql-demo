import { makeExecutableSchema } from "@graphql-tools/schema"
import { addMocksToSchema } from "@graphql-tools/mock"
import { graphql } from "graphql"

// Fill this in with the schema string
const typeDefs = `#graphql
  type Author {
    id: Int!
    firstName: String
    lastName: String
    """
    the list of Posts by this author
    """
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  type A {
    id:ID 
    name:String
    }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    user:A
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost(postId: Int!): Post
  }
`

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: typeDefs })

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({ schema })

const query = `
  query tasksForUser {
    user{
      id
      name
    }
  }
`

graphql({
  schema: schemaWithMocks,
  source: query,
}).then((result) => console.log("Got result", result))
