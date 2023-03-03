import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const typeDefs = `#graphql
directive @lower(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION | ENUM_VALUE

directive @fetchField(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION | ENUM_VALUE

interface Book {
  title: String! @fetchField
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

input Input {
  id: Int
  age: String 
}


interface HH {
  g: Int 
}

interface CreateByBase implements HH{
  f: String @fetchField
  b: Int
  g: Int @fetchField
}

type A implements CreateByBase & HH {
   num: Int @fetchField   
   text: String 
   f: String
   b: Int
   g: Int
}

enum B {
   STR,
   CODE  
}

type ReturnType {
   class: String 
   numType: A @fetchField  
   textEnum: B   
}

type Sdl {
  sdl:String
}

type Query {
# , age: Input!
  search(contains: String @fetchField): ReturnType 
 # books: [Book!]!
  _service: Sdl,
}
`

const resolvers = {
  // Book: {
  //   __resolveType(book, contextValue, info) {
  //     // Only Textbook has a courses field
  //     if (book.courses) {
  //       return "Textbook"
  //     }
  //     // Only ColoringBook has a colors field
  //     if (book.colors) {
  //       return "ColoringBook"
  //     }

  //     return null // GraphQLError is thrown
  //   },
  // },
  Query: {
    _service: () => ({
      sdl: typeDefs,
    }),
    // books: (_, args) => {
    //   return [
    //     {
    //       //   __typename: "Textbook",
    //       title: "The Complete Works of William Shakespeare",
    //       author: "wyq",
    //       courses: ["数学"],
    //     },
    //     {
    //       //   __typename: "ColoringBook",
    //       title: "William Shakespeare",
    //       author: "wiq",
    //       colors: ["#eee"],
    //     },
    //   ]
    // },
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
