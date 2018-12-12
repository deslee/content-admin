module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        },
        password: {
            type: DataTypes.STRING
        }
    })

    return Post;
}