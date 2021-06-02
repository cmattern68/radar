let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const weatherValidator = require('../validator/weatherValidator')
const weatherController = require('../controllers/weatherController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.json());

router.get('/metar/:icao', weatherValidator.validIcao, weatherController.getMetar);
router.get('/taf/:icao', weatherValidator.validIcao, weatherController.getTaf);

module.exports = router;