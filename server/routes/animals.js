var express = require('express');

module.exports = (models) => {
    const router = express.Router()

    router.get('/', (req, res) => {
        models.animals.findAll()
            .then(animals => {
                res.json(animals)
            })
    })

    router.get('/:id', (req, res) => {
        const id = req.params.id;
        models.animals.find({
            where: { id }
        }).then(animal => {
            if (animal) {
                res.send(animal)
            } else {
                res.send(404)
            }
        })
    })

    router.post('/', (req, res) => {
        const name = req.body.name
        const type = req.body.type

        console.log(req.body)

        models.animals.create({
            name,
            type
        }).then(animal => {
            res.json(animal)
        })
    })

    router.patch('/:id', (req, res) => {
        const id = req.params.id;
        models.animals.find({
            where: { id }
        }).then(animal => {
            if (!animal) {
                res.send(404)
                return;
            }

            animal.update(req.body).then(animal => {
                res.send(animal)
            })
        })
    })

    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        models.animals.destroy({
            where: { id }
        }).then(animal => {
            res.json(animal)
        })
    })

    return router;
}