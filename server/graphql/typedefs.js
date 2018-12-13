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

    interface Slice {
        type: SliceType
    }

    type ImageSlice implements Slice {
        type: SliceType
        asset: [Asset]
    }

    type VideoSlice implements Slice {
        type: SliceType
        url: String
        loop: Boolean
        autoplay: Boolean
    }

    type ParagraphSlice implements Slice {
        type: SliceType
        text: String
    }

    type Post {
        id: String
        title: String
        date: String
        password: String
        categories: [Category]
        slices: [Slice]
    }


    type Category {
        id: String
        site: Site
        name: String
        posts: [Post]
    }

    type Site {
        id: String
        name: String
        categories: [Category]
        posts: [Post]
    }


    interface Response {
        success: Boolean!
        message: String
    }

    type CategoryResponse implements Response {
        category: Category
        success: Boolean!
        message: String
    }

    type AssetResponse implements Response {
        asset: Asset
        success: Boolean!
        message: String
    }

    type SliceResponse implements Response {
        slice: Slice
        success: Boolean!
        message: String
    }

  
    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
      sites: [Site]!
      site(siteId: String!): Site!
      posts(siteId: String!): [Post]!
      post(postId: String!): Post!
      categories(siteId: String!): [Category]!
    }

    # upsert a site
    input SiteInput {
        id: String
        name: String
    }
    input SliceInput {
        type: SliceType
        url: String
        loop: Boolean
        autoplay: Boolean
        text: String
        assetIds: [String]
    }
    # upsert a post with categories
    input PostInput {
        id: String
        title: String
        date: String
        password: String
        categories: [String]
        slices: [SliceInput]
    }
    type SiteResponse implements Response {
        site: Site
        success: Boolean!
        message: String
    }

    type PostResponse implements Response {
        post: Post
        success: Boolean!
        message: String
    }

    type Mutation {
        upsertSite(site: SiteInput!): SiteResponse!
        upsertPost(post: PostInput!, siteId: String!): PostResponse!
        deleteSite(siteId: String!): Response
        deletePost(postId: String!): Response
    }
  `;

module.exports = typeDefs;