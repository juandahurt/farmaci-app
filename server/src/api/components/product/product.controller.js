const ERRORS = require('./product.errors');
const Product = require('./product.model');
const Category = require('../category/category.model');
const sequelizeDB = require('../../../sequelize');

const productController = {
    /**
     * Crea un nuevo producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async create(req, res) {
        let id = req.body._id;
        let description = req.body._description;
        let comes_in_boxes = req.body._comesInBoxes;
        let comes_in_units = req.body._comesInUnits;
        let comes_in_others = req.body._comesInOthers;
        let box_price = req.body._boxPrice;
        let unit_price = req.body._unitPrice;
        let other_price = req.body._otherPrice;
        let base_price = req.body._basePrice;
        let category_id = req.body._category._id;

        if (!id) {
            res.status(422).send({error: ERRORS.INVALID_ID});
            return;
        }
        if (!description) {
            res.status(422).send({error: ERRORS.INVALID_DESC});
            return;
        }
        if (!base_price) {
            res.status(422).send({error: ERRORS.INVALID_BASE_PRICE});
            return;
        }
        if (comes_in_boxes && !box_price) {
            res.status(422).send({error: ERRORS.INVALID_BOX_PRICE});
            return;
        }
        if (comes_in_units && !unit_price) {
            res.status(422).send({error: ERRORS.INVALID_UNIT_PRICE});
            return;
        }
        if (comes_in_others && !other_price) {
            res.status(422).send({error: ERRORS.INVALID_OTHER_PRICE});
            return;
        }

        await sequelizeDB.sync();

        let product = await Product.findOne({ where: { description: description } });
        if (product) {
            res.status(422).send({ error: ERRORS.DESC_ALREADY_USED});
            return;
        }

        product = await Product.findOne({ where: { id: id } });
        if (product) {
            res.status(422).send({ error: ERRORS.ID_ALREADY_USED});
            return;
        }

        try {
            let created = await Product.create({
                id: id,
                description: description,
                comes_in_boxes: comes_in_boxes,
                comes_in_units: comes_in_units,
                comes_in_others: comes_in_others,
                box_price: box_price,
                unit_price: unit_price,
                other_price: other_price,
                base_price: base_price,
                category_id: category_id
            });
            res.status(200).send(created);
        } catch(err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Lista todas los productos.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async list(req, res) {
        await sequelizeDB.sync();

        let products = await Product.findAll({ 
            include: [Category]
        });

        res.status(200).send(products);
    },
}

module.exports = productController;