const express = require('express');
const router = express.Router();
const cinemaController = require('../controllers/cinemaController');

router.get('/', cinemaController.getAllCinemas);
router.get('/:id', cinemaController.getCinemaById);
router.post('/', cinemaController.createCinema);
router.put('/:id', cinemaController.updateCinema);
router.patch('/:id', cinemaController.patchCinema);
router.delete('/:id', cinemaController.deleteCinema);

module.exports = router;

