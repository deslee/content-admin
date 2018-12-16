module.exports = {
    typeDef: `
    type Post {
        id: String
        title: String
        site: Site
        date: String
        password: String
        categories: [Category]
        slices: [Slice]
    }

    input PostInput {
        id: String
        siteId: String!
        title: String
        date: String
        password: String
        categories: [String]
        slices: [SliceInput]
    }

    type PostResponse implements Response {
        post: Post
        success: Boolean!
        message: String
    }
    `,
    resolvers: {
        Query: {
            posts: async(_, { siteId }, { dataSources: { cmsData } }) => {
                const posts = await cmsData.getPostsForSite(siteId);
                return posts;
            },
            post: async(_, { postId }, { dataSources: { cmsData } }) => {
                const posts = await cmsData.getPost(postId);
                return posts;
            }
        },
        Mutation: {
            upsertPost: async (_, args, { dataSources: { cmsData } }) => {
                const upsertedPost = await cmsData.upsertPost(args.post);
                return {
                    success: true,
                    post: upsertedPost
                }
            },
            deletePost: async (_, args, { dataSources: { cmsData } }) => {
                await cmsData.deletePost(args.postId);
                return {
                    success: true
                }
            }
        },
        Site: {
            posts: async (site, args, { dataSources: { cmsData } } ) => {
                const posts = await cmsData.getPostsForSite(site.id);
                return posts;
            }
        },
        Category: {
            posts: async (category, args, { dataSources: { cmsData } } ) => {
                const posts = await cmsData.getPostsForCategory(category.id);
                return posts;
            }
        }
    }
}