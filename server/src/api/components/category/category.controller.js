const ERRORS = require('./category.errors');
const Category = require('./category.model');
const sequelizeDB = require('../../../sequelize');

const categoryController = {
    /**
     * Crea una nueva categoría.
     * @param {object} req - petición del cliente
     * @param {oobject} res - respuesta del servidor
     */
    async create(req, res) {
        let name = req.body._name;

        if (!name) {
            res.status(422).send({error: ERRORS.INVALID_NAME});
            return;
        }

        await sequelizeDB.sync();

        let category = await Category.findOne({ where: { name: name } });
        
        if (category) {
            res.status(422).send({ error: ERRORS.NAME_ALREADY_USED});
            console.log(category);
            return;
        }

        try {
            await Category.create({ name: name });
            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(500);
        }
    },
    /**
     * Obtiene todas las categorías.
     * @param {object} req - petición del cliente
     * @param {oobject} res - respuesta del servidor
     */
    async list(req, res) {
        await sequelizeDB.sync();

        let categories = await Category.findAll({ order: [['createdAt', 'DESC']] });

        res.status(200).send(categories);
    }
}

module.exports = categoryController;