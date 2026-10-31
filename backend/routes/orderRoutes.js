const express = require('express');
const router = express.Router();
const { getAll, create, update, remove, getMyOrders } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

router.get('/my-orders', verifyToken, getMyOrders);  // user xem đơn của mình
router.get('/', verifyAdmin, getAll);                // chỉ admin xem tất cả
router.post('/', verifyToken, create);               // đăng nhập mới đặt hàng được
router.put('/:id', verifyAdmin, update);             // chỉ admin
router.delete('/:id', verifyAdmin, remove);          // chỉ admin

module.exports = router;