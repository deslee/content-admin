module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define('animal', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            required: true
        },
        type: {
            type: DataTypes.ENUM,
            values: ['dog', 'cat']
        },
    })
    return Animal;
}