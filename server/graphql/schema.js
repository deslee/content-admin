const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./typedefs')

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Slice: {
        __resolveType(obj, context, info) {
            if (!obj.type) return null

            if (obj.type === 'IMAGE') {
                return 'ImageSlice'
            }
            if (obj.type === 'VIDEO') {
                return 'VideoSlice'
            }
            if (obj.type === 'PARAGRAPH') {
                return 'ParagraphSlice'
            }
            return null
        }
    },
    Response: {
        __resolveType(obj, context, info) {
            if (obj.Site) return 'SiteResponse'
            if (obj.Post) return 'PostResponse'
            if (obj.Category) return 'CategoryResponse'
            if (obj.Asset) return 'AssetResponse'
            if (obj.Slice) return 'SliceResponse'
            return null
        }
    },
    Query: {
        sites: async (parent, args, { dataSources: { cmsData } }, info) => {
            return await cmsData.getSites()
        },
        site: async (parent, { siteId }, { dataSources: { cmsData } }, info) => {
            return await cmsData.getSite(siteId)
        },
        post: async (parent, { postId }, { dataSources: { cmsData } }, info) => {
            return await cmsData.getPost(postId)
        }
    },
    Site: {
        posts: (site, _, { dataSources: { cmsData } }) => {
            var posts = cmsData.getPostsForSite(site.id);
            return posts;
        }
    },
    Mutation: {
        upsertSite: async (_, { site }, { dataSources: { cmsData } }) => {
            const upsertedSite = await cmsData.upsertSite(site)
            return {
                success: true,
                site: upsertedSite
            }
        },
        upsertPost: async (_, { post, siteId }, { dataSources: { cmsData } }) => {
            const upsertedPost = await cmsData.upsertPost(post, siteId)
            return {
                success: true,
                post: upsertedPost
            }
        },
        deleteSite: async (_, { siteId }, { dataSources: { cmsData } }) => {
            await cmsData.deleteSite(siteId);
            return {
                success: true
            }
        },
        deletePost: async (_, { postId }, { dataSources: { cmsData } }) => {
            await cmsData.deletePost(postId);
            return {
                success: true
            }
        }
    }
};

module.exports = {
    typeDefs,
    resolvers
}