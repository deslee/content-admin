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
    `
}