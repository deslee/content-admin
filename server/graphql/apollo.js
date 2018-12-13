const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const CmsDataSource = require('./datasources/cmsDataSource')

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  dataSources: () => ({
    cmsData: new CmsDataSource()
  })
});

module.exports = server;