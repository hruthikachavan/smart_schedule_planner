const router  = require('express').Router();
const protect = require('../middlewares/auth.middleware');
const { register, login, me } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, me);

module.exports = router;
