const express = require('express');
const flightsRouter = require('./routes/flightsRouter');
const airportsRouter = require('./routes/airportsRouter');
const weatherRouter = require('./routes/weatherRouter');
const coordinatesRouter = require('./routes/coordinatesRouter');
const cors = require('cors')

const app = express();
app.use(cors())

app.use('/flights', flightsRouter);
app.use('/airports', airportsRouter);
app.use('/weather', weatherRouter);
app.use('/coordinate', coordinatesRouter);

module.exports = app;