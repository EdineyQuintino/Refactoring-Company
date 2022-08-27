require('dotenv').config();
const express = require('express');

const functionariRoutes = require('./routes/functionari');
const patientRoutes = require('./routes/patient');
const medicRoutes = require('./routes/medic');

const app = express();
      
const PORT = process.env.PORT || 3334;
app.use(express.json());

app.use(functionariRoutes);
app.use(patientRoutes);
app.use(medicRoutes);

app.listen(PORT,()=>{
    console.log('Running on port',PORT);
});