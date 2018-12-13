const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const SiteDataSource = require('./datasources/siteDataSource');

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  dataSources: () => ({
    site: new SiteDataSource()
  })
});

module.exports = server;