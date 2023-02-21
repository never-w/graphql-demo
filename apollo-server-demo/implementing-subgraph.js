import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import gql from "graphql-tag"
import { buildSubgraphSchema } from "@apollo/subgraph"

const typeDefs = gql`
  extend schema @link(url: "http://192.168.10.233:9406/graphql", import: ["@key", "@shareable"])

  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`

const resolvers = {
  Query: {
    me() {
      return { id: "1", username: "@ava" }
    },
  },
  User: {
    __resolveReference(user, { fetchUserById }) {
      return fetchUserById(user.id)
    },
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
})

const { url } = await startStandaloneServer(server)
console.log(`🚀  Server ready at ${url}`)
