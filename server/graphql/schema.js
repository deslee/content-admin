const { ApolloServer, gql } = require('apollo-server');
const { typeDef: Asset } = require('./schema/asset')
const { typeDef: Category } = require('./schema/category')
const { typeDef: Post } = require('./schema/post')
const { typeDef: Shared, resolvers: sharedResolvers } = require('./schema/shared')
const { typeDef: Site, resolvers: siteResolvers } = require('./schema/site')
const { typeDef: Slice, resolvers: sliceResolvers } = require('./schema/slice')
const { merge } = require('lodash')

const Query = `
type Query {
    sites: [Site]!
    site(siteId: String!): Site!
    posts(siteId: String!): [Post]!
    post(postId: String!): Post!
    categories(siteId: String!): [Category]!
}
`

const resolvers = {
}

const Mutation = `
type Mutation {
    upsertSite(site: SiteInput!): SiteResponse!
    deleteSite(siteId: String!): GenericResponse
}
`

module.exports = {
    typeDefs: [Shared, Asset, Category, Post, Site, Slice, Query, Mutation],
    resolvers: merge(resolvers, siteResolvers, sharedResolvers, sliceResolvers)
}