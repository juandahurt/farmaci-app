const config = require('./config/config');
const app = require('./express');
const sequelize = require('./sequelize');

// Base de datos
sequelize.authenticate()
.then(() => {
    console.error('server: database connected');
})
.catch((err) => {
    console.error('server: database connection error: %s', err.message);
});

// Servidor
app.listen(config.port, (err) => {
    if (err) {
        console.error('server: error: %s', err.message);
    }
    console.log('server: listening on port %s.', config.port);
});