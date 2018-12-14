module.exports = {
    typeDef: `
    type Category {
        id: String
        site: Site
        name: String
        posts: [Post]
    }

    type CategoryResponse implements Response {
        category: Category
        success: Boolean!
        message: String
    }
    `,
    resolvers: {
        Post: {
            categories: async (post, args, { dataSources: { cmsData } } ) => {
                const categories = await cmsData.getCategoriesForPost(post.id);
                return categories;
            }
        },
        Site: {
            categories: async (site, args, { dataSources: { cmsData } } ) => {
                const categories = await cmsData.getCategoriesForSite(site.id);
                return categories;
            }
        }
    }
}