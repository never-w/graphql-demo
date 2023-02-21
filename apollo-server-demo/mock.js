import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { addMocksToSchema } from "@graphql-tools/mock"
import { makeExecutableSchema } from "@graphql-tools/schema"

const resolvers = {
  Query: {
    name: () => "wyq",
  },
}

const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    name: String
  }
`

const mocks = {
  Book: () => ({
    title: "sss",
    author: "111",
  }),
  Int: () => 6,
  Float: () => 22.1,
  String: () => "Hello",
}

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    mocks,
    preserveResolvers: true,
  }),
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
