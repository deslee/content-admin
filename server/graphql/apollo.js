const { typeDefs, resolvers } = require('./schema');
const CmsDataSource = require('./datasources/cmsDataSource');

module.exports = {
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  dataSources: () => ({
    cmsData: new CmsDataSource()
  })
};