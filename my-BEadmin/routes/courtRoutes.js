const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');


router.post('/', courtController.createCourt);


router.get('/', courtController.getCourts);


router.get('/:id', courtController.getCourtById);


router.put('/:id', courtController.updateCourt);


router.delete('/:id', courtController.deleteCourt);


router.get('/:id/availability', courtController.checkAvailability);

module.exports = router;
