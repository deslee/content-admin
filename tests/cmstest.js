const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const Site = sequelize.define('site', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    }
})

const Category = sequelize.define('category', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Site,
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Site,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE
    },
    password: {
        type: Sequelize.STRING
    },
    passwordSalt: {
        type: Sequelize.STRING
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    }
});

const Slice = sequelize.define('slice', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    type: {
        type: Sequelize.ENUM('paragraph', 'image', 'video')
    },
    siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Site,
            key: 'id'
        }
    },
    postId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Post,
            key: 'id'
        }
    },
    paragraph_text: {
        type: Sequelize.TEXT('long')
    },
    video_url: {
        type: Sequelize.STRING
    },
    video_loop: {
        type: Sequelize.BOOLEAN
    },
    video_autoplay: {
        type: Sequelize.BOOLEAN
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    }
})

const Asset = sequelize.define('asset', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Site,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.ENUM('image')
    },
    description: {
        type: Sequelize.TEXT('medium')
    },
    url: {
        type: Sequelize.STRING
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    }
})

const AssetSlice = sequelize.define('assetslice', {
    siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Site,
            key: 'id'
        }
    },
    assetId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Asset,
            key: 'id'
        }
    },
    sliceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Slice,
            key: 'id'
        }
    },
})

const PostCategory = sequelize.define('postcategory', {
    siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Site,
            key: 'id'
        }
    },
    postId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Post,
            key: 'id'
        }
    },
    categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    },
})

// associations to / from site
Site.hasMany(Post)
Post.belongsTo(Site)
Site.hasMany(Category)
Category.belongsTo(Site)
Site.hasMany(Slice)
Slice.belongsTo(Site)
Site.hasMany(Asset)
Asset.belongsTo(Site)
Site.hasMany(AssetSlice)
AssetSlice.belongsTo(Site)
Site.hasMany(PostCategory)
PostCategory.belongsTo(Site)

// async function run() {
//     await sequelize.sync();
//     console.log('synced');

//     var site = await Site.create({
//         name: 'Desmond\'s blog',
//         data: {
//             foo: 'bar'
//         }
//     })

//     console.log('created a site', site.toJSON());

//     var post = await Post.create({
//         siteId: site.id,
//         title: 'First post!',
//         date: new Date(),
//         data: {
//             foo: 'bar'
//         }
//     })

//     var slice = await Slice.create({
//         type: 'image',
//         siteId: site.id,
//         postId: post.id,
//         data: {
//             'foo': 'bar'
//         }
//     })

//     var asset = await Asset.create({
//         siteId: site.id,
//         title: 'My picture',
//         type: 'image',
//         description: 'This is my pretty picture',
//         url: 'http://google.com',
//         data: {
//             foo: 'bar'
//         }
//     })

//     var assetSlice = await AssetSlice.create({
//         siteId: site.id,
//         assetId: asset.id,
//         sliceId: slice.id
//     })

//     var category = await Category.create({
//         siteId: site.id,
//         name: 'Artwork'
//     })

//     var postCategory = await PostCategory.create({
//         siteId: site.id,
//         postId: post.id,
//         categoryId: category.id
//     })
// }

// run().then(() => {
//     console.log('done!')
// })