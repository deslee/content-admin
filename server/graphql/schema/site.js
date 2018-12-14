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
            deleteSite: async (_, { siteId }, { dataSources: { cmsData } }) => {
                await cmsData.deleteSite(siteId);
                return {
                    success: true
                }
            },
        }
    }
}