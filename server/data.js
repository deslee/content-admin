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
    text: {
        type: Sequelize.TEXT('long')
    },
    url: {
        type: Sequelize.STRING
    },
    loop: {
        type: Sequelize.BOOLEAN
    },
    autoplay: {
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
Post.hasMany(Slice)

PostCategory.belongsTo(Category, { foreignKey: 'categoryId' })
PostCategory.belongsTo(Post, { foreignKey: 'postId' })

module.exports = {
    sequelize, Sequelize,

    // models
    Site, Category, Post, Slice, Asset, AssetSlice, PostCategory, 
}