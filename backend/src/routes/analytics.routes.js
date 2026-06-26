const router  = require('express').Router();
const protect = require('../middlewares/auth.middleware');
const { getInsights } = require('../controllers/analytics.controller');

router.use(protect);
router.get('/insights', getInsights);

module.exports = router;
