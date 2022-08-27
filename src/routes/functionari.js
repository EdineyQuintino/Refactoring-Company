const express = require('express');

const FunctionariController = require('../controllers/FunctionariController');

const routes = express.Router();

routes.get('/functionari', FunctionariController.index);
routes.get('/functionari/:id', FunctionariController.filter);
routes.post('/functionari', FunctionariController.create);
routes.patch('/functionari/:id', FunctionariController.patch);
routes.delete('/functionari/:id', FunctionariController.delete);

module.exports = routes;
