const ProductSold = require('../product-sold/product-sold.model');
const Bill = require('../bill/bill.model');
const Sequelize = require('sequelize');
const dateHelper = require('../../helpers/date.helper');
const moment = require('moment');
const Op = Sequelize.Op;

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
            var n = 0;
            var period = '';

            switch (date_n) {
                case 0:
                    goalDate = dateHelper.getTodayDate();
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

            /*// Se buscan las facturas registradas en el día de hoy
            let today_bills = await Bill.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: dateHelper.getTodayDate(),
                        [Op.lt]: new Date()
                    }
                }
            });

            // Se obtienen los productos vendidos el día de hoy
            var productsSold = [];
            today_bills.forEach(async bill => {
                let products = await ProductSold.findAll({ 
                    where: {
                        bill_id: bill.id
                    }
                });
                products.forEach(product => {
                    productsSold.push(product);
                });
            });*/
            
            res.status(200).send({
                profits: profits,
                sells: sells
            });
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    }
}

module.exports = statsContoller;