import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const typeDefs = `#graphql
interface Book {
  title: String!
  author: String!
}

type Textbook implements Book {
  title: String!
  author: String!
  courses: [String!]!
}

type ColoringBook implements Book {
  title: String!
  author: String!
  colors: [String!]!
}

type Query {
  books: [Book!]!
}
`

const resolvers = {
  Book: {
    __resolveType(book, contextValue, info) {
      // Only Textbook has a courses field
      if (book.courses) {
        return "Textbook"
      }
      // Only ColoringBook has a colors field
      if (book.colors) {
        return "ColoringBook"
      }

      return null // GraphQLError is thrown
    },
  },
  Query: {
    books: (_, args) => {
      return [
        {
          //   __typename: "Textbook",
          title: "The Complete Works of William Shakespeare",
          author: "wyq",
          courses: ["数学"],
        },
        {
          //   __typename: "ColoringBook",
          title: "William Shakespeare",
          author: "wiq",
          colors: ["#eee"],
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
