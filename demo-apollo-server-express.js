const express = require("express")
const { ApolloServer, gql } = require("apollo-server-express")

const typeDefs = gql`
  type Option {
    label: String
    value: Int
  }

  type Query {
    hello: String
    name: String
    age: Int
    list: [Option]
  }
`

const resolvers = {
  Int: () => 12312,
  Query: {
    hello: () => "Hello world!",
    name: () => "银巧",
    list: () => [
      {
        label: "西瓜",
        value: 10,
      },
      {
        label: "苹果",
        value: 20,
      },
    ],
  },
}

const app = express()
const server = new ApolloServer({
  typeDefs: typeDefs,
  mocks: {
    ...resolvers,
  },
})
server.start().then(() => {
  server.applyMiddleware({ app })
  app.listen({ port: 4000 }, () => console.log("Now browse to http://localhost:4000" + server.graphqlPath))
})
