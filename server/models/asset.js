module.exports = (sequelize, DataTypes) => {
    const Asset = sequelize.define('Asset', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('image')
        },
        description: {
            type: DataTypes.TEXT('medium')
        },
        url: {
            type: DataTypes.STRING
        }
    })

    return Asset;
}