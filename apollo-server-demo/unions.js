import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const typeDefs = `#graphql
union SearchResult = Book | Author

type Book {
  title: String!
}

type Author {
  name: String!
}

type Query {
  search(contains: String): [SearchResult!]
}
`

const resolvers = {
  SearchResult: {
    __resolveType(obj, contextValue, info) {
      console.log(obj, "999999999999")
      // Only Author has a name field
      if (obj.name) {
        return "Author"
      }
      // Only Book has a title field
      if (obj.title) {
        return "Book"
      }
      return null // GraphQLError is thrown
    },
  },
  Query: {
    search: (_, args) => {
      return [
        {
          title: "The Complete Works of William Shakespeare",
        },
        {
          name: "William Shakespeare",
        },
      ]
    },
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
