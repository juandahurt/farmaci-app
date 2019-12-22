const config = require('./config/config');
const express = require('express');
const morgan = require('morgan');
const restRouter = require('./api');
const cors = require('cors');

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// development
if (config.env === 'dev') { 
    app.use(morgan('dev'));
}

// REST router
app.use(cors());
app.use('/api', restRouter);

module.exports = app;