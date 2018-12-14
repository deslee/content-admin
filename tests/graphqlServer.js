const { ApolloServer } = require('apollo-server')
const apolloServerConfig = require('../server/graphql/apollo')
const data = require('../server/data')

const apolloServer = new ApolloServer(apolloServerConfig)

apolloServer.listen();