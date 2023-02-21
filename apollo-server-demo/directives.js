import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils"
import { defaultFieldResolver, printSchema, buildClientSchema, getIntrospectionQuery } from "graphql"

// Our GraphQL schema
const typeDefs = `#graphql
  directive @upper on FIELD_DEFINITION

  type A {
    name: String! @upper
  }

  type StringOption {
  """
  描述
  """
  label: Int

  """
  值
  """
  value: String ! @upper
}

  type Query {
    deliveryBillType: [StringOption]
    hello: A
    oldField: String
    _schema: String
  }
`

// Our resolvers (notice the hard-coded string is *not* all-caps)
const resolvers = {
  Query: {
    hello() {
      return "Hello World!"
    },
    _schema: () => typeDefs,
  },
}

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
function upperDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if (upperDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info)
          if (typeof result === "string") {
            return result.toUpperCase()
          }
          return result
        }
        return fieldConfig
      }
    },
  })
}

// Create the base executable schema
let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// Transform the schema by applying directive logic
schema = upperDirectiveTransformer(schema, "upper")

const server = new ApolloServer({ schema, introspection: true })

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
await server.executeOperation({ query: getIntrospectionQuery() })

console.log(`🚀 Server listening at: ${url}`)

// async function aa() {
//   const { data } = await server.executeOperation({ query: getIntrospectionQuery() })
//   const schema1 = buildClientSchema(data)

//   console.log(printSchema(schema1), "===")
// }
// aa()

// server.executeOperation({ query: getIntrospectionQuery() }).then((res) => {
//   console.log(printSchema(buildClientSchema(res.body.singleResult.data)))
// })
