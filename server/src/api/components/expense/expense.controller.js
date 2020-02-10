const ERRORS = require('./expense.errors');
const Expense = require('./expense.model');
const Provider = require('../provider/provider.model');

const expenseController = {
    /**
     * Registra un nuevo egreso.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async create(req, res) {
        try {
            let bill_id = req.body._billId;
            let description = req.body._description;
            let value = req.body._value;
            let provider_id = req.body._provider._id;

            console.log(provider_id);

            if (!description) {
                res.status(422).send({error: ERRORS.INVALID_DESC});
                return;
            }

            if (!value) {
                res.status(422).send({error: ERRORS.INVALID_VALUE});
                return;
            }

            await Expense.create({
                bill_id: bill_id,
                description: description,
                value: value,
                provider_id: provider_id
            });

            res.sendStatus(200);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Obtiene todos los egresos registrados
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async list(req, res) {
        try {
            let expenses = await Expense.findAll({
                include: [Provider]
            });

            console.log(expenses);
            
            res.status(200).send(expenses);
        } catch (err) {
            res.status(500).send({err: err.message});
        }
    },
    /**
     * Elimina un egreso todos los egresos registrados
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async delete(req, res) {
        try {
            let id = req.params.id;

            let expense = await Expense.findOne({
                where: {
                    id: id
                }
            });

            await expense.destroy();

            res.sendStatus(200);
        } catch (err) {
            res.status(500).send({err: err.message});
        }
    }
}

module.exports = expenseController;