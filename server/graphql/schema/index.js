const { typeDef: Asset, resolvers: assetResolvers } = require('./asset')
const { typeDef: Category, resolvers: categoryResolvers } = require('./category')
const { typeDef: Post, resolvers: postResolvers } = require('./post')
const { typeDef: Shared, resolvers: sharedResolvers } = require('./shared')
const { typeDef: Site, resolvers: siteResolvers } = require('./site')
const { typeDef: Slice, resolvers: sliceResolvers } = require('./slice')

module.exports = {
    typeDefs: { Shared, Asset, Category, Post, Site, Slice },
    resolvers: {
        categoryResolvers,
        postResolvers,
        sharedResolvers,
        siteResolvers,
        sliceResolvers
    }
}