module.exports = {
    typeDef: `
    enum AssetType {
        IMAGE
    }
    
    type Asset {
        id: String
        title: String
        type: AssetType
        description: String
        url: String
    }

    type AssetResponse implements Response {
        asset: Asset
        success: Boolean!
        message: String
    }
    `,
    resolvers: () => {}
}