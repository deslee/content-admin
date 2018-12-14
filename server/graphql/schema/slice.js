module.exports = {
    typeDef: `
    enum SliceType {
        PARAGRAPH
        IMAGE
        VIDEO
    }

    interface Slice {
        id: String!
        type: SliceType
    }

    type ImageSlice implements Slice {
        id: String!
        type: SliceType
        asset: [Asset]
    }

    type VideoSlice implements Slice {
        id: String!
        type: SliceType
        url: String
        loop: Boolean
        autoplay: Boolean
    }

    type ParagraphSlice implements Slice {
        id: String!
        type: SliceType
        text: String
    }

    input SliceInput {
        id: String
        type: SliceType
        url: String
        loop: Boolean
        autoplay: Boolean
        text: String
        assetIds: [String]
    }

    type SliceResponse implements Response {
        slice: Slice
        success: Boolean!
        message: String
    }
    `,
    resolvers: {
        Slice: {
            __resolveType(obj, context, info) {
                if (!obj.type) return null
    
                if (obj.type === 'IMAGE') {
                    return 'ImageSlice'
                }
                if (obj.type === 'VIDEO') {
                    return 'VideoSlice'
                }
                if (obj.type === 'PARAGRAPH') {
                    return 'ParagraphSlice'
                }
                return null
            }
        }
    }
}