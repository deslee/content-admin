module.exports = {
    typeDef: `
    type Post {
        id: String
        title: String
        date: String
        password: String
        categories: [Category]
        slices: [Slice]
    }

    input PostInput {
        id: String
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
    `
}