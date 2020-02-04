const ProductSold = require('../product-sold/product-sold.model');
const Bill = require('../bill/bill.model');
const Sequelize = require('sequelize');
const dateHelper = require('../../helpers/date.helper');
const moment = require('moment');
const Op = Sequelize.Op;
const Product = require('../product/product.model');

const statsContoller = {
    /**
     * Obtiene las estdísticas.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async get(req, res) {
        try {
            let date_n = req.body.date;
            var goalDate = null;
            var n = 0; // Contador que indica la cantidad de valores
            var period = '';

            switch (date_n) {
                case 0:
                    goalDate = dateHelper.getYesterdayDate();
                    n = 1;
                    period = 'days';
                    break;
                case 1:
                    goalDate = dateHelper.getLastWeekDate();
                    n = 7;
                    period = 'days';
                    break;
                case 2:
                    goalDate = dateHelper.getLastMonthDate();
                    n = 30;
                    period = 'days';
                    break;
                case 3:
                    goalDate = dateHelper.getLastYearDate();
                    n = 12;
                    period = 'months';
                    break;
            }

            var profits = [];
            var sells = [];
            while (n > 0) {
                goalDate = moment(goalDate, 'DD-MM-YYYY');
                goalDate.add(1, period);
                let endDate = moment(goalDate, 'DD-MM-YYYY');
                endDate.add(1, period);

                // Se obtienen las facturas por fecha requerida
                let bills = await Bill.findAll({
                    where: {
                        createdAt: {
                            [Op.gt]: goalDate.toDate(),
                            [Op.lt]: endDate.toDate()
                        }
                    }
                });

                // Se obtiene el total de las facturas (ingresos)
                var total = 0;
                bills.forEach(bill => { total += bill.total; });
        
                var label = '';
                if (date_n == 3) { 
                    label = dateHelper.getMonthLabel(goalDate.toDate()) 
                } else { 
                    label = dateHelper.cleanDate(goalDate.toDate()); 
                }

                profit = {
                    label: label,
                    data: total
                }
                profits.push(profit);

                sell = {
                    label: label,
                    data: bills.length
                }
                sells.push(sell);

                n--;
            }

            // Se buscan las unidades vendidas en el día
            let productsSoldToday = await ProductSold.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: dateHelper.getTodayDate(),
                        [Op.lt]: new Date()
                    }
                },
                include: [Product]
            });

            // Se organizan las unidades vendidas por producto
            var productsSorted = [];
            productsSoldToday.forEach(productSold => {
                // Se busca si el producto ya fue agregado
                var productFound = null;
                for(var i = 0; i < productsSorted.length; i++) {
                    if (productsSorted[i].product.id == productSold.product_id) { 
                        productFound = productsSorted[i]; 
                        break;
                    } 
                }
                let unitType = productSold.unit_type.toString();
                if (!productFound) {
                    // Se agrega el producto con el tipo de unidad y cantidad vendida.
                    // product = { 
                    //  'id': identificador, 
                    //  'description': descripción de producto, 
                    //  'tipoUnidad': cantidad vendida (pueden ser los tres tipos de unidad)
                    //  }
                    
                    // Si el producto no ha sido eliminado
                    if (productSold.product) {
                        product = {
                            'id': productSold.product_id,
                            'description': productSold.product.description
                        }
                        product[unitType] = productSold.quantity
                        productsSorted.push({ product });
                    }
                } else {
                    if (productFound.product[unitType]) {
                        productFound.product[unitType] += productSold.quantity;
                    } else {
                        // Se agrega el nuevo tipo de unidad
                        productFound.product[unitType] = productSold.quantity;
                    }
                }
            });

            res.status(200).send({
                profits: profits,
                sells: sells,
                productsSoldToday: productsSorted
            });
        } catch (err) {
            res.status(500).send({error: err.message});
            console.log(err.message);
        }
    }
}

module.exports = statsContoller;