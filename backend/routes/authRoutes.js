const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerSchema ,loginSchema } = require('../validators/authValidator');


router.post('/register', validate(registerSchema), register); 
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyToken, logout);

module.exports = router;