let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const coordinatesValidator = require('../validator/coordinatesValidator')
const coordinatesController = require('../controllers/coordinatesController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.json());

router.get('/:lon/:lat', coordinatesValidator.validLonLat, coordinatesController.getCountry);

module.exports = router;