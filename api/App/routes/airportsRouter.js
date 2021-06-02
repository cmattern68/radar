let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const airportsValidator = require('../validator/airportsValidator')
const airportsController = require('../controllers/airportsController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.json());

router.get('/', airportsController.getAirports);
router.get('/country/:country', airportsValidator.validCode, airportsController.getCountryAirports);

module.exports = router;