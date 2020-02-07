const Provider = require('./provider.model');

const statsContoller = {
    /**
     * Registra un proveedor.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async create(req, res) {
        try {
            let name = req.body._name;

            let provider = await Provider.create({
                name: name
            });

            res.status(200).send(provider);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Obtiene todos los proveedores.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async list(req, res) {
        try {
            let providers = await Provider.findAll({});

            res.status(200).send(providers);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    },
    /**
     * Elimina un proveedor.
     * @param {object} req - petición del cliente
     * @param {object} res - respuesta del servidor
     */
    async delete(req, res) {
        try {
            let id = req.params.id;
            
            let provider = await Provider.findOne({ 
                where: { id: id } 
            });

            await provider.destroy();

            res.sendStatus(200);
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    }
}

module.exports = statsContoller;