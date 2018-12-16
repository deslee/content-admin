const { Op } = require('sequelize')
const { DataSource } = require('apollo-datasource');
const data = require('../../data')

const Mappers = {
    Site: site => ({
        id: site.id,
        name: site.name
    }),
    Post: post => ({
        id: post.id,
        title: post.title,
        date: post.date,
        slices: (post.slice || []).map(Mappers.Slice)
    }),
    Category: category => ({
        id: category.id,
        name: category.name
    }),
    Slice: slice => ({
        id: slice.id,
        type: slice.type,
        text: slice.text,
        url: slice.url,
        autoplay: slice.autoplay,
        loop: slice.loop
    })
}

class CmsDataSource extends DataSource {
    constructor() {
        super()
    }

    async getSites() {
        var sites = await data.Site.findAll();
        sites = sites.map(Mappers.Site)
        return sites;
    }

    async getSite(siteId) {
        var site = await data.Site.find({ where: { id: { [Op.eq]: siteId } } })
        return site && Mappers.Site(site);
    }

    async getSiteFromPostId(postId) {
        var post = await data.Post.find({ where: { id: { [Op.eq]: postId } } })
        return await this.getSite(post.siteId);
    }

    async upsertSite(site) {
        if (!site.data) { site.data = {} }
        if (site.id) {
            await data.Site.update(site, { where: { id: { [Op.eq]: site.id } } });
            return site;
        } else {
            const createdSite = await data.Site.create(site);
            return Mappers.Site(createdSite)
        }
    }

    async getCategoriesForPost(postId) {
        const postCategories =
            await data.PostCategory.findAll({ where: { postId: { [Op.eq]: postId } } })
        const categories = await data.Category.findAll({ where: { id: { [Op.in]: postCategories.map(pc => pc.categoryId) } } })
        return categories.map(Mappers.Category)
    }

    async getCategoriesForSite(siteId) {
        const postCategories =
            await data.PostCategory.findAll({ where: { siteId: { [Op.eq]: siteId } } })
        const categories = await data.Category.findAll({ where: { id: { [Op.in]: postCategories.map(pc => pc.categoryId) } } })
        return categories.map(Mappers.Category)
    }

    async upsertPost(post) {
        let response;
        if (!post.data) { post.data = {} }

        if (post.id) {
            await data.Post.update(post, { where: { id: { [Op.eq]: post.id } } })
            response = post;
        } else {
            if (!post.date) { post.date = new Date() }
            response = await data.Post.create(post);
            response = Mappers.Post(response);
            post.id = response.id
        }

        if (!post.slices) post.slices = []
        if (!post.categories) post.categories = []

        if (post.categories.length) {
            // get all categories mentioned in post
            let foundCategories = await data.Category.findAll({
                where: {
                    [Op.and]: [
                        {
                            siteId: {
                                [Op.eq]: post.siteId
                            }
                        },
                        {
                            name: {
                                [Op.in]: post.categories
                            }
                        }
                    ]
                }
            })

            // add categories that do not exist yet
            let createdCategories = await Promise.all(post.categories.filter(c => !foundCategories.find(fc => fc.name === c))
                .map(categoryName => data.Category.create({
                    siteId: post.siteId,
                    name: categoryName
                })));

            let categories = foundCategories.concat(createdCategories);

            let allPostCategories = await data.PostCategory.findAll({
                where: {
                    [Op.and]: [
                        {
                            postId: {
                                [Op.eq]: post.id
                            }
                        },
                        {
                            siteId: {
                                [Op.eq]: post.siteId
                            }
                        }
                    ]
                }
            })

            // add categories to post
            await Promise.all(categories.filter(category => !allPostCategories.find(pc => pc.categoryId === category.id))
                .map(category => data.PostCategory.create({
                    siteId: post.siteId,
                    postId: post.id,
                    categoryId: category.id
                })));
            // remove categories from post
            let categoriesToRemoveFromPost
                = allPostCategories.filter(pc => !categories.find(c => c.id === pc.categoryId));
            if (categoriesToRemoveFromPost.length) {
                await data.PostCategory.destroy({
                    where: {
                        id: {
                            [Op.in]: categoriesToRemoveFromPost.map(c => c.id)
                        }
                    }
                })
            }
        }

        if (post.slices.length) {
            // prepopulate required members if nonexistant
            post.slices.forEach(slice => { 
                if (!slice.data) { slice.data = {} } 
                if (!slice.siteId) { slice.siteId = post.siteId } 
                if (!slice.postId) { slice.postId = post.id } 
            })

            // get all slices belonging to post
            var slicesInDb = await data.Slice.findAll({ where: { postId: { [Op.eq]: post.id } } })

            // add slices without ids
            let createdSlices = await Promise.all(post.slices.filter(slice => !slice.id).map(slice => data.Slice.create(slice)))

            // delete slices that do not exist in the post anymore
            let slicesToDelete = slicesInDb.filter(dbSlice => !post.slices.find(s => s.id === dbSlice.id))
            if (slicesToDelete.length) {
                await data.Slice.destroy({
                    where: {
                        id: {
                            [Op.in]: slicesToDelete.map(s => s.id)
                        }
                    }
                })
            }

            // update slices with ids
            let slicesToUpdate = post.slices.filter(s => s.id);
            await Promise.all(slicesToUpdate.map(slice => data.Slice.update(slice, { where: { id: { [Op.eq]: slice.id } } })))

            response.slices = createdSlices.concat(slicesToUpdate)
        }

        return response
    }

    async getPostsForSite(siteId) {
        var result = await data.Post.findAll({
            where: {
                siteId: { [Op.eq]: siteId }
            },
            include: {
                model: data.Slice
            }
        })
        result = result.map(Mappers.Post)
        return result
    }

    async getPost(postId) {
        var result = await data.Post.find({
            where: {
                id: { [Op.eq]: postId }
            },
            include: {
                model: data.Slice
            }
        })
        result = result && Mappers.Post(result)
        return result
    }

    async getPostsForCategory(categoryId) {
        var postCategories = await data.PostCategory.findAll({
            where: {
                categoryId: { [Op.eq]: categoryId }
            },
            include: {
                model: data.Post,
                include: data.Slice
            }
        })
        var posts = postCategories.map(pc => pc.post)
        posts = posts.map(Mappers.Post)
        return posts
    }

    async deleteSite(siteId) {
        await data.Site.destroy({
            where: {
                id: {
                    [Op.eq]: siteId
                }
            }
        })
    }

    async deletePost(postId) {
        await data.PostCategory.destroy({
            where: {
                postId: {
                    [Op.eq]: postId
                }
            }
        })
        await data.Slice.destroy({
            where: {
                postId: {
                    [Op.eq]: postId
                }
            }
        })

        await data.Post.destroy({
            where: {
                id: {
                    [Op.eq]: postId
                }
            }
        })
    }
}

module.exports = CmsDataSource;