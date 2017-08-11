const express = require('express')
const graphqlHTTP = require('express-graphql')

const { schema, rootResolver } = require('./graphql')


const app = express()

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: rootResolver,
    graphiql: true,
}));

const PORT = process.env.NODE_ENV || 3000
app.listen(PORT, err => {
    if (err) {
        console.error('Failed to start server', err)
    } else {
        console.log('Server started at port:', PORT)
    }
})

/*
CURL CMD FOR TESTING
(U may pipe curl to jq[https://stedolan.github.io/jq/] for nicely formated json)

1.

curl -XPOST -H "Content-Type:application/graphql"  -d ' 
query {
    allDrivers{
    id
    firstName
    lastName
    assignedCars {
      id
      name
      licenseNo
      addedAt
    }
  }
}' http://localhost:3000/graphql

2.

curl -XPOST -H "Content-Type:application/graphql"  -d ' 
query {
    driver(id: 1){
    id
    firstName,
    assignedCars {
      id
      name
    }
  }
}' http://localhost:3000/graphql

*/
