const ERRORS = require('./category.errors');
const Category = require('./category.model');
const sequelizeDB = require('../../../sequelize');

const categoryController = {
    /**
     * Crea una nueva categoría.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
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
     * @param {object} res - respuesta del servidor
     */
    async list(req, res) {
        await sequelizeDB.sync();

        let categories = await Category.findAll({ order: [['createdAt', 'DESC']] });

        res.status(200).send(categories);
    },
    /**
     * Obtiene una categoría.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async get(req, res) {
        let id = req.params.id;

        await sequelizeDB.sync();

        let category = await Category.findByPk(id);

        res.status(200).send(category);
    },
    /**
     * Actualiza una categoría.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async update(req, res) {
        let id = req.params.id;
        let name = req.body._name;

        await sequelizeDB.sync();

        let categoryFound = await Category.findOne({ where: { name: name } });
        
        if (categoryFound) {
            res.status(422).send({ error: ERRORS.NAME_ALREADY_USED});
            return;
        }

        let category = await Category.update(
            { name: name }, 
            { returning: true, where: { id: id } }
        );

        res.status(200).send(category);
    },
}

module.exports = categoryController;