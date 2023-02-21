import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { GraphQLScalarType, Kind } from "graphql"

const typeDefs = `#graphql
  scalar Date

  type Event {
    id: ID!
    date: Date!
  }

  type Query {
    events: [Event!]
  }
`

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime() // Convert outgoing Date to integer for JSON
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object")
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value) // Convert incoming integer to Date
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`")
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10))
    }
    // Invalid hard-coded value (not an integer)
    return null
  },
})

const resolvers = {
  Date: dateScalar,
  Query: {
    events: () => [
      {
        id: "11",
        date: new Date(),
      },
    ],
  },
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
})
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})
console.log(`🚀  Server ready at: ${url}`)
