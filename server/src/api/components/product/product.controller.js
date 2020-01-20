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
    /**
     * Obtiene un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async get(req, res) {
        let id = req.params.id;

        await sequelizeDB.sync();

        let product = await Product.findOne({where: { id: id }, include: [Category] })

        if (!product) {
            res.status(422).send({error: ERRORS.PRODUCT_NOT_FOUND});
            return;
        }

        res.status(200).send(product);
    },
    /**
     * Elimina un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async delete(req, res) {
        let id = req.params.id;

        await sequelizeDB.sync();

        await Product.destroy({where: { id: id } })

        res.sendStatus(200);
    },
    /**
     * Actualiza un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async update(req, res) {
        let old_id = req.params.id;
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

        let product = await Product.findOne({ where: { description: description } });
        if (product && product.id != old_id) {
            res.status(422).send({ error: ERRORS.DESC_ALREADY_USED});
            return;
        }

        if (id != old_id) {
            product = await Product.findOne({ where: { id: id } });
            if (product) {
                res.status(422).send({ error: ERRORS.ID_ALREADY_USED});
                return;
            }
        }

        // Atualiza el producto
        try {
            await sequelizeDB.sync();

            await Product.update(
                {
                    id: id,
                    description: description,
                    box_price: box_price,
                    unit_price: unit_price,
                    other_price: other_price,
                    base_price: base_price,
                    category_id: category_id 
                },
                { where: { id: old_id } }
            );
            res.sendStatus(200);
        } catch(err) {
            res.status(500).send({error: err.message});
        }
    
    },
}

module.exports = productController;