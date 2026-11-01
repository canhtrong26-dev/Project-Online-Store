const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/userController');
const { verifyAdmin } = require('../middlewares/auth')

router.get('/', verifyAdmin, getAll) //chỉ admin xem được tất cả 

router.post('/', verifyAdmin, create) //chỉ admin thêm mới user
router.put('/:id', verifyAdmin, update)//chỉ admin sửa user
router.delete('/:id', verifyAdmin, remove)//chỉ admin xóa user

module.exports = router;