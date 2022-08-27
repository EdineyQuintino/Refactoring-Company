const express = require('express');

const PatientController = require('../controllers/PatientController');

const routes = express.Router();

routes.get('/patient', PatientController.index);
routes.get('/patient/:id', PatientController.filter);
routes.post('/patient', PatientController.create);
routes.patch('/patient/:id', PatientController.patch);
routes.delete('/patient/:id', PatientController.delete);

module.exports = routes;
