const { DataSource } = require('apollo-datasource');
const { promisify } = require('util');
const redis = require('redis')
const uuidv4 = require('uuid/v4');

class CmsDataSource extends DataSource {
    constructor() {
        super()
        this.client = redis.createClient()

        this.client.on("error", function (err) {
            console.log("Error " + err);
        });

        this.get = promisify(this.client.get).bind(this.client);
        this.set = promisify(this.client.set).bind(this.client);
        this.hmset = promisify(this.client.hmset).bind(this.client);
        this.sadd = promisify(this.client.sadd).bind(this.client);
        this.smembers = promisify(this.client.smembers).bind(this.client);
        this.srem = promisify(this.client.srem).bind(this.client)
        this.smembers = promisify(this.client.smembers).bind(this.client);
        this.hgetall = promisify(this.client.hgetall).bind(this.client);
        this.del = promisify(this.client.del).bind(this.client);
    }

    upsertSite(site) {
        if (!site.id) {
            site.id = uuidv4();
        }
        return this.hmset(`sites:${site.id}`, site)
            .then(() => this.sadd('sites', site.id))
            .then(() => site)
    }

    deleteSite(siteId) {
        return this.del(`sites:${siteId}`)
            .then(() => this.srem('sites', siteId))
    }

    getSites() {
        return this.smembers('sites')
            .then(siteIds => Promise.all(siteIds.map(siteId => this.getSite(siteId))))
    }

    getSite(siteId) {
        return this.hgetall(`sites:${siteId}`) 
            .then(site => site)
    }

    getPostsForSite(siteId) {
        return this.smembers(`site-post:${siteId}`)
            .then(postIds => Promise.all(postIds.map(postId => this.getPost(postId))))
    }

    upsertPost(post, siteId) {
        if (!post.id) post.id = uuidv4();
        post.siteId = siteId
        return this.set(`posts:${post.id}`, JSON.stringify(post))
            .then(() => this.sadd(`site-post:${siteId}`, post.id))
            .then(() => {
                if (post.categories && post.categories.length) {
                    post.categories.map(categoryName => {
                        this.sadd(`site-categoryName:${siteId}`, categoryName)
                        this.sadd(`siteCategoryName-post:${siteId}-${categoryName}`, post.id)
                    })
                }
            })
            .then(() => post)
    }

    deletePost(postId) {
        var post;
        return this.get(`posts:${postId}`)
            .then(p = post = JSON.parse(p))
            .then(() => this.del(`posts:${postId}`))
            .then(() => this.srem(`site-post:${post.siteId}`, postId))
    }

    getPost(postId) {
        return this.get(`posts:${postId}`)
            .then(p => JSON.parse(p))
    }
}

module.exports = CmsDataSource;