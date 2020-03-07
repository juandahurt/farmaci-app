const ERRORS = require('./dimension.errors');
const Dimension = require('./dimension.model');
const Product = require('../product/product.model');
const sequelizeDB = require('../../../sequelize');

const dimensionController = {
    /**
     * Agrega las dimensiones de tipo de unidad a un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async create(req, res) {
        let product_id = req.body.product_id;
        let others = req.body.dimension._others;
        let units = req.body.dimension._units;


        let product = await Product.findOne({ where: { id: product_id } });

        if (product.comes_in_boxes && product.comes_in_others && !product.comes_in_units) { 
            if (!others) { 
                res.status(422).send({ error: ERRORS.INVALID_DIMENSION })
                return;   
            }
        }

        if (product.comes_in_boxes && product.comes_in_units && !product.comes_in_others) { 
            if (!units) { 
                res.status(422).send({ error: ERRORS.INVALID_DIMENSION })
                return;   
            }
        }

        if (product.comes_in_others && product.comes_in_units && !product.comes_in_boxes) { 
            if (!units) { 
                res.status(422).send({ error: ERRORS.INVALID_DIMENSION })
                return;   
            }
        }

        if (product.comes_in_boxes && product.comes_in_others && product.comes_in_units) { 
            if (!others || !units) { 
                res.status(422).send({ error: ERRORS.INVALID_DIMENSION })
                return;   
            }
        }

        await sequelizeDB.sync();
    
        try {
            await Dimension.create({
                others: others,
                units: units,
                product_id: product_id
            });
            res.sendStatus(200);
        } catch(err) {
            res.status(500).json(err.message);
        }
    },
    /**
     * Obtiene las dimensiones de tipo de unidad de un producto.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async get(req, res) {
        let product_id = req.params.id;

        await sequelizeDB.sync();
    
        try {
            let dimension = await Dimension.findOne(
                { where: {
                    product_id: product_id
                } 
            });
            res.status(200).send(dimension);
        } catch(err) {
            res.status(500).json(err.message);
        }
    }
}

module.exports = dimensionController;