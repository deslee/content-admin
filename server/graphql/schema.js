const { ApolloServer, gql } = require('apollo-server');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.
  
    # This "Book" type can be used in other type declarations.
    enum SliceType {
        PARAGRAPH
        IMAGE
        VIDEO
    }

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

    type ImageSlice {
        id: String
        type: SliceType
        asset: [Asset]
    }

    type VideoSlice {
        id: String
        type: SliceType
        url: String
        loop: Boolean
        autoplay: Boolean
    }

    type ParagraphSlice {
        id: String
        type: SliceType
        text: String
    }

    union Slice = ImageSlice | VideoSlice | ParagraphSlice

    type Post {
        id: String
        title: String
        date: String
        password: String
        slices: [Slice]
    }

    type Category {
        id: String
        name: String
        posts: [Post]
    }

    type Site {
        id: String
        name: String
        categories: [Category]
    }

  
    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
      sites: [Site]
    }
  `;



// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
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
    },
    Query: {
        sites: (parent, args, { dataSources }, info) => { 
            const includeCategories = true
            const includePosts = true 
            const includeSlices = true 
            const includeAssets = true
            return dataSources.site.getSites({includeCategories, includePosts, includeSlices, includeAssets})
        },
    },
};

module.exports = {
    typeDefs,
    resolvers
}