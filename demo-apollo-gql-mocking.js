const express = require("express")
const path = require("path")
const { ApolloServer } = require("apollo-server-express")
const { importSchema } = require("graphql-import")
const Mock = require("mockjs")

const { Random } = Mock
const mock = {
  Int: () => Random.integer(0, 100),
  String: () => Random.ctitle(2, 4),
  ID: () => Random.id(),
  Boolean: () => Random.boolean(),
  BigDecimal: () => Random.integer(0, 1000000),
  Float: () => Random.float(0, 100),
  Date: () => Random.date(),
  DateTime: () => Random.datetime(),
  Long: () => Random.integer(0, 10000),
  NumberOrBoolOrStringOrNull: () => null,
  NumberOrString: () => null,
}

const typeDefs = importSchema(path.join(__dirname, "schema.graphql"))
const app = express()
const server = new ApolloServer({ typeDefs, mocks: mock })
server.start().then(() => {
  server.applyMiddleware({ app })
  app.listen({ port: 5000 }, () => console.log("Now browse to http://localhost:5000" + server.graphqlPath))
})
