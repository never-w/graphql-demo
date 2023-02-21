var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`#graphql 
directive @upper on FIELD_DEFINITION

  type RandomDie {
    numSides: Int! @upper
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
   }

  type _Service {
    sdl: String!
   }

  type Query {
    _service: _Service!
    quoteOfTheDay: String
    random: Float!
    getDie(numSides: Int): RandomDie
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`)

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll({ numRolls }) {
    var output = []
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random: () => {
    return Math.random()
  },
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6)
  },
  rollDice: ({ numDice, numSides }) => {
    var output = []
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)))
    }
    return output
  },
}

const app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(5000, () => {
  console.log("Running a GraphQL API server at http://localhost:5000/graphql")
})

// TODO:下面注释的代码是  客户端请求代码
// var dice = 3
// var sides = 6
// var query = `query GetDie($dice: Int!, $sides: Int!) {
//   getDie(numSides: $dice){
//      rollOnce
//      numSides
//      roll(numRolls: $sides)
//   }
// }`

// fetch("/graphql", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   body: JSON.stringify({
//     query,
//     variables: { dice, sides },
//   }),
// })
//   .then((r) => r.json())
//   .then((data) => console.log("data returned:", data))
