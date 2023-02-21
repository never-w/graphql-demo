import { GraphQLError } from "graphql"

const resolvers = {
  Query: {
    // Example resolver
    adminExample: (parent, args, contextValue, info) => {
      if (contextValue.authScope !== ADMIN) {
        throw new GraphQLError("not admin!", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const user = await getUserFromReq(req)
    if (!user) {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      })
    }

    // If the below throws a non-GraphQLError, the server returns
    // `code: "INTERNAL_SERVER_ERROR"` with an HTTP status code 500, and
    // a message starting with "Context creation failed: ".
    const db = await getDatabaseConnection()

    return { user, db }
  },
})
