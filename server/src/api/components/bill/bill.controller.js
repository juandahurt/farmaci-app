const Bill = require('./bill.model');
const Unit = require('../unit/unit.model');
const Product = require('../product/product.model');
const ProductSold = require('../product-sold/product-sold.model');
const Dimension = require('../dimension/dimension.model');

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

                    // Dimensiones del producto
                    let dimension = Dimension.findOne({ 
                        where: { product_id: product.id }
                    });

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
                            var big, small, big_quantity, small_quantity, small_sold, small_sold_atr;
                            // big:            Tipo de unidad que contiene la unidad más pequena. 
                            // small:          Tipo de unidad más pequeña.
                            // big_quantity:   Nombre del atribuo de la cantidad total en bodega 
                            //                 del tipo de unidad más grande.
                            // small_quantity: Nombre del atribuo de la cantidad total en bodega 
                            //                 del tipo de unidad más grande.
                            // small_sold:     Cantidad vendidad del tipo de unidad más pequeña
                            //                 (dentro de la unidad más próxima a expirar).
                            // small_sold_atr: Nombre del atributo que contiene la cantidad vendida
                            //                 del tipo de unidad más pequeña.

                            if (product.comes_in_boxes && product.comes_in_others) {
                                big = 'boxes';
                                small = 'others';
                                big_quantity = 'box_quantity';
                                small_quantity = 'other_quantity';
                                small_sold = unitToExpire.others_sold;
                                small_sold_atr = 'others_sold';
                            } else if (product.comes_in_boxes && product.comes_in_units) {
                                big = 'boxes';
                                small = 'units';
                                big_quantity = 'box_quantity';
                                small_quantity = 'unit_quantity';
                                small_sold = unitToExpire.units_sold;
                                small_sold_atr = 'units_sold';
                            } else {
                                big = 'others';
                                small = 'units';
                                big_quantity = 'other_quantity';
                                small_quantity = 'unit_quantity';
                                small_sold = unitToExpire.units_sold;
                                small_sold_atr = 'units_sold';
                            }

                            othersSold = unitToExpire.others_sold;
                            if (unitType == big) {
                                // Se van a restar unidades del tipo de unidad más grande
                                if (quantity - unitsRemoved < stock) {
                                    unitToExpire[unitType] = stock - (quantity - unitsRemoved);
                                    unitToExpire[small] -= (quantity - unitsRemoved) * dimension[small];
                                    await unitToExpire.save();
                                    product[small_quantity] -= (quantity - unitsRemoved) * dimension[small];
                                    product[big_quantity] -= (quantity - unitsRemoved);
                                    unitsRemoved = quantity;
                                } else {
                                    unitsRemoved += stock;
                                    if (small_sold == 0) {
                                        await unitToExpire.destroy();
                                    } else {
                                        unitToExpire[big] = 0;
                                        await unitToExpire.save();
                                    }
                                    product[small_quantity] -= stock * dimension[small];
                                    product[big_quantity] -= stock;
                                }
                            } else if (unitType == small) {
                                // Se van a restar unidades del tipo de unidad más pequeña
                                if (small_sold == 0) {
                                    product[big_quantity]--;
                                    unitToExpire[big]--;
                                    await unitToExpire.save();
                                }
                                if (dimension[small] - small_sold < quantity) {
                                    // Se necesita más de una unidad grande
                                    unitsRemoved += dimension[small] - small_sold;
                                    product[small] -= dimension[small] - small_sold;
                                    if (unitToExpire[big] == 0) {
                                        await unitToExpire.destroy();
                                    } else {
                                        unitToExpire[small] -= dimension[small] - small_sold;
                                        unitToExpire[small_sold_atr] = 0;
                                        await unitToExpire.save();
                                    }
                                } else if (small_sold + quantity == dimension[small]) {
                                    unitToExpire[small_sold_atr] = 0;
                                    product[small_quantity] -= quantity;
                                    unitsRemoved = quantity;
                                    unitToExpire[small] -= quantity - unitsRemoved;
                                    if (unitToExpire[big] == 0) {
                                        await unitToExpire.destroy();
                                    } else {
                                        unitToExpire[big]--;
                                        product[big_quantity]--;
                                        await unitToExpire.save();
                                    }
                                } else {
                                    // Esta unidad es suficiente
                                    unitToExpire[small_sold_atr] += quantity - unitsRemoved;
                                    unitToExpire[small] -= quantity - unitsRemoved;
                                    await unitToExpire.save();
                                    product[small_quantity] -= quantity - unitsRemoved;
                                    unitsRemoved = quantity;
                                }
                            }
                            await product.save(); // Se actualiza el producto
                            break;
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