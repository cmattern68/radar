let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
//const defaultValidator = require('../validator/defaultValidator')
const flightsController = require('../controllers/flightsController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.json());

router.get('/', flightsController.getFlights);

module.exports = router;