const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const Site = require('./models/site')(sequelize, Sequelize)
const Category = require('./models/category')(sequelize, Sequelize)
const Asset = require('./models/asset')(sequelize, Sequelize)
const Post = require('./models/post')(sequelize, Sequelize)
const Slice = require('./models/slice')(sequelize, Sequelize)
const AssetSlice = require('./models/assetSlice')(sequelize, Sequelize)

Category.belongsTo(Site, {
    foreignKey: {
        allowNull: false,
        field: 'siteId'
    },
    as: 'site'
})
Site.hasMany(Category, {
    foreignKey: 'siteId'
})

Post.belongsTo(Category, {
    foreignKey: {
        allowNull: false,
        field: 'categoryId'
    },
    as: 'category'
})
Category.hasMany(Post, {
    foreignKey: 'categoryId'
})

Slice.belongsTo(Post, {
    foreignKey: {
        allowNull: false,
        field: 'postId'
    },
    as: 'post'
})
Post.hasMany(Slice, {
    foreignKey: 'postId'
})

Asset.belongsToMany(Slice, {
    through: AssetSlice,
    foreignKey: 'assetId'
})

const includeSliceAsset = Slice.belongsToMany(Asset, {
    through: AssetSlice,
    foreignKey: 'sliceId'
})

const seed = () => Promise.all([
])

module.exports = {
    Sequelize,
    sequelize,

    models: {
        Site,
        Category,
        Asset,
        Post,
        Slice,
        AssetSlice
    },
    associations: {
        includeSliceAsset
    },

    seed
};