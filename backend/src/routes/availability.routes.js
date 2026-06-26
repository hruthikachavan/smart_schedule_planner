const router = require('express').Router();
const protect = require('../middlewares/auth.middleware');
const availabilityController = require('../controllers/availability.controller');

router.use(protect);

router.get('/',       availabilityController.getSlots);
router.post('/',      availabilityController.createSlot);
router.put('/bulk',   availabilityController.bulkReplaceSlots);
router.put('/:id',    availabilityController.updateSlot);
router.delete('/:id', availabilityController.deleteSlot);

module.exports = router;
