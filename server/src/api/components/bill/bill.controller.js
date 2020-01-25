const Bill = require('./bill.model');
const Unit = require('../unit/unit.model');
const Product = require('../product/product.model');
const ProductSold = require('../product-sold/product-sold.model');

const billController = {
    /**
     * Crea una nueva factura.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async create(req, res) {
        let productsSold = req.body;

        productsSold.forEach(async productSold => {
            try {
                let product = await Product.findOne({ where: { id: productSold._product._id }});
                let quantity = productSold._quantity;
                let unitsRemoved = 0;

                while (unitsRemoved < quantity) {
                    // Obtener las unidades del producto organizados por fecha de vencimiento
                    let units = await Unit.findAll({
                        where: { product_id: product.id },
                        order: [['expires_at', 'ASC']]
                    });
                    let unitToExpire = null; // Unidad más próxima a vencer
                    // Lo siguiente se realiza para no tomar en cuenta
                    // la unidad que no tenga la cantidad requerida en bodega 
                    // del tipo de unidad
                    for (var unitToExpireIndex = 0; unitToExpireIndex < units.length; unitToExpireIndex++) {
                        switch (productSold._unitType) {
                            case 'Caja':
                                if (units[unitToExpireIndex].boxes != 0) { unitToExpire = units[unitToExpireIndex]; }
                                break;
                            case 'Sobre':
                                if (units[unitToExpireIndex].others != 0) { unitToExpire = units[unitToExpireIndex]; }
                                break;
                            case 'Unidad':
                                if (units[unitToExpireIndex].units != 0) { unitToExpire = units[unitToExpireIndex]; }
                                break;
                        }
                        if (unitToExpire != null) { break; }
                    }
                    // Se obtiene la cantidad de tipos de unidad por la que viene el producto
                    let numTypes = 0; // Cantidad de tipos de unidad
                    if (product.comes_in_boxes) { numTypes++; }
                    if (product.comes_in_others) { numTypes++; }
                    if (product.comes_in_units) { numTypes++; }

                    // Obtiene el nombre del tipo de unidad para facilitar acceso al atributo
                    let unitType = getUnitType(productSold._unitType);

                    // Obtiene la cantidad en bodega del tipo de unidad
                    let stock = unitToExpire[unitType];

                    switch (numTypes) { 
                        case 1:
                            //
                            // El producto viene en un único tipo de unidad
                            //
                            var quantityRemoved = 0;

                            if (quantity - unitsRemoved >= stock) {
                                unitsRemoved += stock;
                                await unitToExpire.destroy();
                                quantityRemoved = stock;
                            } else {
                                unitToExpire[unitType] = stock - (quantity - unitsRemoved);
                                await unitToExpire.save(); // Actualiza la cantidad
                                quantityRemoved = quantity - unitsRemoved;
                                unitsRemoved = quantity;
                            }
                            
                            switch (productSold._unitType) {
                                case 'Caja': 
                                    product.box_quantity -= quantityRemoved;
                                    break;
                                case 'Sobre':
                                    product.other_quantity -= quantityRemoved;
                                    break;
                                case 'Unidad':
                                    product.unit_quantity -= quantityRemoved;
                                    break;
                            }
                            await product.save(); // Actualiza el total
                            break;
                        case 2:
                            //
                            // El producto viene en dos tipos de unidad
                            //
                            throw new Error('No se ha implementado dos tipos de unidades');
                        case 3:
                            //
                            // El producto viene en todos los tipos de unidad
                            //
                            throw new Error('No se ha implementado tres tipos de unidades');
                        default:
                            // En caso que numTypes = 0. ¡Nunca debería llegar aquí!
                            res.status(500).send({});
                            break;
                    }
                }

                // Se registra cada producto dentro de una nueva factura
                let bill = await Bill.create();
                productsSold.forEach(async productSold => {
                    await ProductSold.create({
                        product_id: productSold._product._id,
                        bill_id: bill.id,
                        quantity: productSold._quantity,
                        unit_type: productSold._unitType
                    });
                });
                
                res.sendStatus(200);
            } catch (err) {
                res.status(500).send({error: err.message});
                return;
            }
        });
    }
}

/**
 * Retorna el nombre del atributo del tipo de unidad
 * @param {string} unitType Tipo de unidad (Como lo ve el usuario)
 */
function getUnitType(unitType) {
    switch (unitType) {
        case 'Caja': return 'boxes';
        case 'Sobre': return 'others';
        case 'Unidad': return 'units';
    }
}

module.exports = billController;