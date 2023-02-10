var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var graphql = require("graphql")

// Maps id to User object
var fakeDatabase = {
  a: {
    id: "a",
    name: "alice",
  },
  b: {
    id: "b",
    name: "bob",
  },
}

// 定义 User 类型
var userType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  },
})

// 定义 Query 类型
var queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: userType,
      // `args` 描述了 `user` 查询接受的参数
      args: {
        id: { type: graphql.GraphQLString },
      },
      resolve: (_, { id }) => {
        return fakeDatabase[id]
      },
    },
  },
})

var schema = new graphql.GraphQLSchema({ query: queryType })

var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
)
app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql")
})

/* 
TODO: 这种方法在你想要通过一些手段（例如数据库 Schema）自动创建 GraphQL Schema 时很有用。
      如此一来你就可以拥有一些类似于创建和更改数据库记录的通用模板。还有，在实现类似集合类
      型（union types）这种没法轻易映射为 ES6 Class 或者纯 Schema Language 实现的功能时，此方法也很有用。 */
