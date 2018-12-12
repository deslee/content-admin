const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const animals = require('./models/animal')(sequelize, Sequelize)

const seedAnimals = () => animals.findAll().then(result => {
    if (result.length === 0) {
        return animals.create({
            name: 'Tina',
            type: 'cat'
        })
    }
})

const seed = () => Promise.all([
    seedAnimals()
])

module.exports = {
    Sequelize,
    sequelize,

    animals,
    
    seed
};