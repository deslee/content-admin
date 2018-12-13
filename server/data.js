const redis = require('redis')
const { promisify } = require('util');
const client = redis.createClient()

const hmset = promisify(client.hmset).bind(client);
const sadd = promisify(client.sadd).bind(client);
const srem = promisify(client.srem).bind(client)
const smembers = promisify(client.smembers).bind(client);
const hgetall = promisify(client.hgetall).bind(client);
const del = promisify(client.del).bind(client);

export function upsertSite(site) {
    if (!site.id) {
        site.id = uuidv4();
    }
    return hmset(`sites:${site.id}`, site)
        .then(() => site)
}

export function deleteSite(siteId) {
    return this.del(`sites:${siteId}`)
        .then(() => ({
            success: true
        }))
}

export function upsertCategory(category) {
    if (!category.id) {
        category.id = uuidv4();
    }
    return hmset(`categories:${category.id}`, category)
        .then(() => category)
}

export function deleteCategory(categoryId) {
    return this.del(`categories:${categoryId}`)
        .then(() => ({
            success: true
        }))
}