const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerSchema ,loginSchema } = require('../validators/authValidator');
const { loginLimiter } = require('../middlewares/rateLimit');

router.post('/register', validate(registerSchema), register); 
router.post('/login', loginLimiter, validate(loginSchema), login); //loginLimiter để chặn dò mật khẩu, validate ở BE
router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyToken, logout);

module.exports = router;