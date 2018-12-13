const { DataSource } = require('apollo-datasource');
const { models: { Site, Category, Post, Slice }, associations } = require('../../data')

class SiteDataSource extends DataSource {
    constructor() {
        super();
    }

    async getSites({ includeCategories, includePosts, includeSlices, includeAssets }) {
        return await Site.findAll(
            {
                include: includeCategories && [
                    {
                        model: Category,
                        include: includePosts && [
                            {
                                model: Post,
                                include: includeSlices && [
                                    {
                                        model: Slice,
                                        include: includeAssets && associations.includeSliceAsset
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
    }
}

module.exports = SiteDataSource;