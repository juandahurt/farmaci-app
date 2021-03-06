const ERRORS = require('./unit.errors');
const Unit = require('./unit.model');
const Product = require('../product/product.model');
const Dimension = require('../dimension/dimension.model');
const sequelizeDB = require('../../../sequelize');

const unitController = {
    /**
     * Agrega unidades a un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async create(req, res) {
        try {
            let product_id = req.params.id;
            let boxes = req.body._boxes;
            let others = req.body._others;
            let units = req.body._units;
            let lot = req.body._lot;

            if (!req.body._expiresAt) {
                res.status(422).send({error: ERRORS.INVALID_EXP_DATE}); 
                return;
            }
            let year = req.body._expiresAt.year;
            let month = req.body._expiresAt.month;
            let day = req.body._expiresAt.day;
            let expires_at = new Date(year, month - 1, day);

            let product = await Product.findOne({
                where: { id: product_id }
            });

            let dimension = Dimension.findOne({ where: { product_id: product_id } });

            if (product.comes_in_boxes) {
                if (!boxes) { 
                    res.status(422).send({error: ERRORS.INVALID_BOXES}); 
                    return;
                }
                if (product.comes_in_others && !product.comes_in_units) {
                    // Viene por cajas y por sobres
                    others = (await dimension).get('others') * boxes;
                    product.box_quantity += boxes;
                    product.other_quantity += others;
                    product.save();
                }
                if (!product.comes_in_others && product.comes_in_units) {
                    // Viene por cajas y por unidades
                    units = (await dimension).get('units') * boxes;
                    product.box_quantity += boxes;
                    product.unit_quantity += units;
                    product.save();
                }
                if (product.comes_in_others && product.comes_in_units) {
                    // Viene por cajas, por sobres y por unidades
                    others = (await dimension).get('others') * boxes;
                    units = (await dimension).get('units') * others;
                    product.box_quantity += boxes;
                    product.other_quantity += others;
                    product.unit_quantity += units;
                    product.save();
                }
            }

            if (!product.comes_in_boxes && product.comes_in_others) {
                if (!others) { 
                    res.status(422).send({error: ERRORS.INVALID_OTHERS});
                    return;
                }
                if (product.comes_in_units) {
                    // Viene por sobres y unidades
                    units = (await dimension).get('units') * others;
                    product.other_quantity += others;
                    product.unit_quantity += units;
                    await product.save();
                } 
            }

            if (!product.comes_in_boxes && !product.comes_in_others && product.comes_in_units) {
                // Viene solamente por unidades
                if (!units) { 
                    res.status(422).send({error: ERRORS.INVALID_UNITS}); 
                    return;
                }
                product.unit_quantity += units;
                await product.save();
            }
            if (!product.comes_in_boxes && product.comes_in_others && !product.comes_in_units) {
                // Viene solamente por sobres
                if (!others) { 
                    res.status(422).send({error: ERRORS.INVALID_OTHERS}); 
                    return;
                }
                product.other_quantity += others;
                await product.save();
            }
            if (product.comes_in_boxes && !product.comes_in_others && !product.comes_in_units) {
                // Viene solamente por cajas
                if (!boxes) { 
                    res.status(422).send({error: ERRORS.INVALID_BOXES}); 
                    return;
                }
                product.box_quantity += boxes;
                await product.save();
            }

            let created = await Unit.create({
                product_id: product_id,
                boxes: boxes,
                others: others,
                units: units,
                lot: lot,
                expires_at: expires_at
            });

            res.status(200).send(created);
        } catch(err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Lista todas las unidades de un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async list(req, res) {
        let id = req.params.id;

        try {
            await sequelizeDB.sync();

            let units = await Unit.findAll({ where: {
                product_id: id
            }});
    
            res.status(200).send(units);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Elimina una unidad de un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async delete(req, res) {
        let unit_id = req.params.unit_id;
        let product_id = req.params.product_id;

        try {
            await sequelizeDB.sync();
            let unit = await Unit.findOne({
                where: {
                    id: unit_id,
                    product_id: product_id
                }
            });
            await unit.destroy();

            let product = await Product.findOne({
                where: { id: product_id }
            });

            if (product.comes_in_boxes) {
                if (product.comes_in_others && !product.comes_in_units) {
                    // Viene por cajas y por sobres
                    product.box_quantity -= unit.boxes;
                    product.other_quantity -= unit.others;
                    product.save();
                }
                if (!product.comes_in_others && product.comes_in_units) {
                    // Viene por cajas y por unidades
                    product.box_quantity -= unit.boxes;
                    product.unit_quantity -= unit.units;
                    product.save();
                }
                if (product.comes_in_others && product.comes_in_units) {
                    // Viene por cajas, por sobres y por unidades
                    product.box_quantity -= unit.boxes;
                    product.other_quantity -= unit.others;
                    product.unit_quantity -= unit.units;
                    product.save();
                }
            }

            if (!product.comes_in_boxes && product.comes_in_others) {
                if (product.comes_in_units) {
                    // Viene por sobres y unidades
                    product.other_quantity -= unit.others;
                    product.unit_quantity -= unit.units;
                    await product.save();
                } 
            }

            if (!product.comes_in_boxes && !product.comes_in_others && product.comes_in_units) {
                product.unit_quantity -= unit.units;
                await product.save();
            }

            res.sendStatus(200);
        } catch(err) {
            res.status(500).send({error: err.message});
        }
    }
}

module.exports = unitController;