// import { ApolloServer } from "@apollo/server"
// import { startStandaloneServer } from "@apollo/server/standalone"

// const typeDefs = `#graphql
// type User {
//   id: ID!
//   name: String
// }

// type Query {
//   user(id: ID!): User
// }
// `

// const users = [
//   {
//     id: "1",
//     name: "Elizabeth Bennet",
//   },
//   {
//     id: "2",
//     name: "Fitzwilliam Darcy",
//   },
// ]

// const resolvers = {
//   Query: {
//     user(parent, args, contextValue, info) {
//       return users.find((user) => user.id === args.id)
//     },
//   },
// }

// const server = new ApolloServer({
//   typeDefs: typeDefs,
//   resolvers,
// })

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// })

// console.log(`🚀  Server ready at: ${url}`)

// demo2
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const libraries = [
  {
    branch: "downtown",
  },
  {
    branch: "riverside",
  },
]

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    branch: "riverside",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    branch: "downtown",
  },
]

const typeDefs = `#graphql
  type Library {
    branch: String!
    books: [Book!]
  }

  type Book {
    title: String!
    author: Author!
  }

  type Author {
    name: String!
  }

  type Query {
    libraries: [Library]
  }
`

// Resolver map
const resolvers = {
  Query: {
    libraries() {
      return libraries
    },
  },
  Library: {
    books(parent) {
      return books.filter((book) => book.branch === parent.branch)
    },
  },
  Book: {
    author(parent) {
      return {
        name: parent.author,
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})
const { url } = await startStandaloneServer(server)
console.log(`🚀 Server listening at: ${url}`)
