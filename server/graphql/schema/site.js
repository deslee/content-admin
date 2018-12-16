module.exports = {
    typeDef: `
    type Site {
        id: String
        name: String
        categories: [Category]
        posts: [Post]
    }

    input SiteInput {
        id: String
        name: String
    }

    type SiteResponse implements Response {
        site: Site
        success: Boolean!
        message: String
    }
    `,
    resolvers: {
        Query: {
            sites: async (_, args, { dataSources: { cmsData } }) => {
                const sites = await cmsData.getSites();
                return sites;
            },
            site: async (_, { siteId }, { dataSources: { cmsData } }) => {
                const site = await cmsData.getSite(siteId);
                return site;
            }
        },
        Mutation: {
            upsertSite: async (_, args, { dataSources: { cmsData } }) => {
                const upsertedSite = await cmsData.upsertSite(args.site)
                return {
                    success: true,
                    site: upsertedSite
                }
            },
            deleteSite: async (_, args, { dataSources: { cmsData } }) => {
                await cmsData.deleteSite(args.siteId);
                return {
                    success: true
                }
            },
        },
        Post: {
            site: async (post, args, { dataSources: { cmsData } }) => {
                const site = await cmsData.getSiteFromPostId(post.id);
                return site;
            }
        }
    }
}