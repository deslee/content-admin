module.exports = (sequelize, DataTypes) => {
    const Site = sequelize.define('Site', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSON
        }
    })

    return Site;
}