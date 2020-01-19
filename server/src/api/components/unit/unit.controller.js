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
                if (!units) { 
                    res.status(422).send({error: ERRORS.INVALID_UNITS}); 
                    return;
                }
                product.unit_quantity += units;
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
        await sequelizeDB.sync();

        let units = await Unit.findAll();

        res.status(200).send(units);
    }
}

module.exports = unitController;