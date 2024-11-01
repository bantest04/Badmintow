const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');


router.post('/register', staffController.register);


router.post('/login', staffController.login);


router.get('/', staffController.getAllStaff);


router.get('/:id', staffController.getStaffById);


router.put('/:id', staffController.updateStaff);

module.exports = router;
