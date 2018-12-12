const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './testDatabase.sqlite'
});

const Site = require('../server/models/site')(sequelize, Sequelize)
const Category = require('../server/models/category')(sequelize, Sequelize)
const Asset = require('../server/models/asset')(sequelize, Sequelize)
const Post = require('../server/models/post')(sequelize, Sequelize)
const Slice = require('../server/models/slice')(sequelize, Sequelize)
const AssetSlice = require('../server/models/assetSlice')(sequelize, Sequelize)

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

var siteId = '';

sequelize.sync().then(() => {
    console.log('synced')
}).then(() => Site.create({
    name: 'Site1'
})).then((site) => {
    siteId = site.id;
    return Category.create({
        name: 'Main',
        siteId: site.id
    })
}).then((category) => {
    return Post.create({
        title: 'First post!',
        date: new Date(),
        categoryId: category.id
    })
}).then(post => {
    return Promise.all([
        Slice.create({
            type: 'paragraph',
            paragraph_text: 'Hello world!',
            postId: post.id
        }),
        Slice.create({
            type: 'video',
            video_url: 'http://youtube.com',
            video_loop: false,
            video_autoplay: true,
            postId: post.id
        }),
        Slice.create({
            type: 'images',
            postId: post.id
        }),
        Asset.create({
            title: 'my image',
            type: 'image',
            description: 'description for my image',
            url: 'http://placehold.it/500/500'
        }),
        Asset.create({
            title: 'another image',
            type: 'image',
            description: 'description for another image',
            url: 'http://placehold.it/600/600'
        })
    ])
}).then(([slice1, slice2, slice3, asset1, asset2]) => {
    return Promise.all([
        AssetSlice.create({
            sliceId: slice3.id,
            assetId: asset1.id
        }),
        AssetSlice.create({
            sliceId: slice3.id,
            assetId: asset2.id
        })
    ])
}).then(() => {
    console.log('done... querying')
}).then(() => {
    return Site.findByPk(siteId, {
        include: [
            {
                model: Category,
                include: [
                    {
                        model: Post,
                        include: [
                            {
                                model: Slice,
                                include: includeSliceAsset
                            }
                        ]
                    }
                ]
            }
        ]
    })
}).then(site => {
    console.log(JSON.stringify(site.toJSON(), null, 2));
})