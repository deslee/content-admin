module.exports = (sequelize, DataTypes) => {
    const Slice = sequelize.define('Slice', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        type: {
            type: DataTypes.ENUM('paragraph', 'images', 'video')
        },

        paragraph_text: {
            type: DataTypes.TEXT('long')
        },

        video_url: {
            type: DataTypes.STRING
        },
        video_loop: {
            type: DataTypes.BOOLEAN
        },
        video_autoplay: {
            type: DataTypes.BOOLEAN
        }
    })

    return Slice;
}