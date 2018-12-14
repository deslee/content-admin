module.exports = {
    typeDef: `
    interface Response {
        success: Boolean!
        message: String
    }
    type GenericResponse implements Response {
        success: Boolean!
        message: String
    }
    `,
    resolvers: {
        Response: {
            __resolveType(obj, context, info) {
                if (obj.Site) return 'SiteResponse'
                if (obj.Post) return 'PostResponse'
                if (obj.Category) return 'CategoryResponse'
                if (obj.Asset) return 'AssetResponse'
                if (obj.Slice) return 'SliceResponse'
                return 'GenericResponse'
            }
        }
    }
}