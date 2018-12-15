const data = require('../server/data');
var assert = require('assert');
const CmsDataSource = require('../server/graphql/datasources/cmsDataSource');
const { resolvers } = require('../server/graphql/schema/')

describe('Graphql Integration Tests', () => {
    const cmsData = new CmsDataSource();
    const context = { dataSources: { cmsData } };

    describe('Site CRUD', function () {
        let siteId;

        describe('Upsert logic', () => {
            it('Should create a site when upserting with no id', async function () {
                const response = await resolvers.siteResolvers.Mutation.upsertSite(
                    null, {
                        site: {
                            name: 'Desmond\'s test site'
                        }
                    },
                    context
                );
                assert(response.success, 'response not successful')
                assert(response.site.id, 'site id does not exist');
                siteId = response.site.id;

                const queryResponse = await resolvers.siteResolvers.Query.site(
                    null, { siteId }, context
                )

                assert(queryResponse.id === siteId, 'Query response id incorrect')
                assert(queryResponse.name === 'Desmond\'s test site', 'site name incorrect')
            });

            it('Should update a site when upserting with an id', async function () {
                const response = await resolvers.siteResolvers.Mutation.upsertSite(
                    null, {
                        site: {
                            id: siteId,
                            name: 'Desmond\'s test site!'
                        }
                    },
                    context
                );
                assert(response.success, 'response not successful')

                const queryResponse = await resolvers.siteResolvers.Query.site(
                    null, { siteId }, context
                )

                assert(queryResponse.id === siteId, 'site id is incorrect');
                assert(queryResponse.name === 'Desmond\'s test site!', 'site name incorrect')
            })
        })

        describe('Posts', () => {
            let postId, otherPostId, visualCategoryId, animationCategoryId, blogCategoryId;
            const visualCategoryName = 'Visual', animationCategoryName = 'Animation', blogCategoryName = 'Blog'
            it('Should be able to create a post with no additional parameters', async function () {
                const postTitle = 'Hello world! This is an empty post';

                const response = await resolvers.postResolvers.Mutation.upsertPost(
                    null, {
                        post: {
                            siteId,
                            title: postTitle,
                        }
                    }, context
                );

                assert(response.success, 'Response not successful')
                assert(postId = response.post.id, 'Post id not present')

                const queryResponse = await resolvers.postResolvers.Query.post(
                    null, { postId: postId }, context
                )
                assert.equal(queryResponse.id, postId)
                assert.equal(queryResponse.title, postTitle)
            })

            it('Should be able to mutate the post that it just created', async function () {
                const newTitle = 'Hello world! This is an empty post that I just edited';
                const response = await resolvers.postResolvers.Mutation.upsertPost(
                    null, {
                        post: {
                            id: postId,
                            siteId,
                            title: newTitle
                        }
                    }, context
                )
                assert(response.success, 'Response not successful')
                assert.equal(response.post.title, newTitle)

                const queryResponse = await resolvers.postResolvers.Query.post(
                    null, { postId: postId }, context
                )
                assert.equal(queryResponse.id, postId)
                assert.equal(queryResponse.title, newTitle)
            })

            it('Should be able to add categories to a post', async function () {
                const response = await resolvers.postResolvers.Mutation.upsertPost(
                    null, {
                        post: {
                            id: postId,
                            siteId,
                            title: 'Hello world! This is an empty post that I just edited',
                            categories: [visualCategoryName, animationCategoryName]
                        }
                    }, context
                )
                assert(response.success, "Response is not successful")

                const postQueryResponse = await resolvers.postResolvers.Query.post(
                    null, { postId: postId }, context
                )
                const categoriesQueryResponse = await resolvers.categoryResolvers.Post.categories(
                    postQueryResponse, null, context
                )

                assert.equal(categoriesQueryResponse.length, 2)
                categoriesQueryResponse.forEach(createdCategory => {
                    if (createdCategory.name === visualCategoryName) {
                        assert(visualCategoryId = createdCategory.id, 'Category does not have an id')
                        console.log('visualCategoryId set to ', visualCategoryId)
                    }
                    else if (createdCategory.name === animationCategoryName) {
                        assert(animationCategoryId = createdCategory.id, 'Category does not have an id')
                    } else {
                        assert.fail("unexpected category " + createdCategory)
                    }
                })

                const postCategories = await data.PostCategory.findAll({
                    where: {
                        postId: postId
                    },
                    include: data.Category
                })

                assert.equal(postCategories.length, 2)
                postCategories.forEach(pc => {
                    assert.equal(pc.siteId, siteId)
                    assert.equal(pc.postId, postId)
                    if (pc.category.name === visualCategoryName) {
                        assert.equal(pc.category.id, visualCategoryId)
                    }
                    else if (pc.category.name === animationCategoryName) {
                        assert.equal(pc.category.id, animationCategoryId)
                    } else {
                        assert.fail("unknown category associated with post")
                    }
                })
            })

            it('Should be able to delete a category from a post', async function () {

                console.log('visualCategoryId set to ', visualCategoryId)
                const response = await resolvers.postResolvers.Mutation.upsertPost(
                    null, {
                        post: {
                            id: postId,
                            siteId,
                            title: 'Hello world! This is an empty post that I just edited',
                            categories: [visualCategoryName]
                        }
                    }, context
                )
                assert(response.success, "Response is not successful")



                const postCategories = await data.PostCategory.findAll({
                    where: {
                        postId: postId
                    },
                    include: data.Category
                })

                assert.equal(postCategories.length, 1);
                assert.equal(postCategories[0].category.id, visualCategoryId)
            })


            it('should be able to create a new post with categories', async function () {
                console.log('visualCategoryId set to ', visualCategoryId)
                const response = await resolvers.postResolvers.Mutation.upsertPost(
                    null, {
                        post: {
                            siteId,
                            title: 'Hello world! This is my special new other post',
                            categories: [visualCategoryName, blogCategoryName]
                        }
                    }, context
                )
                assert(response.success, 'response is not successful')
                assert(otherPostId = response.post.id, 'response has no id?')


                const postQueryResponse = await resolvers.postResolvers.Query.post(
                    null, { postId: otherPostId }, context
                )
                const categoriesQueryResponse = await resolvers.categoryResolvers.Post.categories(
                    postQueryResponse, null, context
                )

                assert.equal(categoriesQueryResponse.length, 2)

                const visualCategory = categoriesQueryResponse.find(c => c.name === visualCategoryName)
                assert.equal(visualCategory.id, visualCategoryId)

                const blogCategory = categoriesQueryResponse.find(c => c.name !== visualCategoryName)
                assert.equal(blogCategory.name, blogCategoryName)
                assert(blogCategoryId = blogCategory.id, 'blog category has no id')
            })

            describe('slices', () => {
                let videoSlice, paragraphSlice
                it('should be able to add slices to a post', async function() {
                    var post = await cmsData.getPost(postId);
                    post.siteId = siteId
                    post.slices = [
                        {
                            type: 'PARAGRAPH', 
                            text: 'Hello world!'
                        },
                        {
                            type: 'VIDEO', 
                            url: "http://youtube.com/ajdsioaj"
                        }
                    ]

                    const response = await resolvers.postResolvers.Mutation.upsertPost(
                        null, { post }, context
                    )

                    assert(response.success, 'response is not successful')
                    // assert database has two slices for the post
                    const dbSlices = await data.Slice.findAll({
                        where: {
                            postId: postId
                        }
                    })
                    assert.equal(dbSlices.length, 2)

                    // test resolvers for slice
                    const resolvedPost = await resolvers.postResolvers.Query.post(
                        null, { postId: postId }, context
                    )

                    assert.equal(resolvedPost.id, postId)
                    assert.equal(resolvedPost.slices.length, 2)
                    assert(paragraphSlice = resolvedPost.slices.find(s => s.type === 'PARAGRAPH'))
                    assert(videoSlice = resolvedPost.slices.find(s => s.type === 'VIDEO'))
                    assert.equal(paragraphSlice.text, 'Hello world!')
                    assert.equal(videoSlice.url, 'http://youtube.com/ajdsioaj')
                })
            })
        })

        it('Should be able to delete the site', async function () {
            const response = await resolvers.siteResolvers.Mutation.deleteSite(
                null, { siteId }, context
            )
            assert(response.success, 'response not successful')

            const queryResponse = await resolvers.siteResolvers.Query.site(
                null, { id: siteId }, context
            )

            assert(queryResponse === null, 'query response is not null?')
        })

    })

})