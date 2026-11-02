const express = require('express');
const router = express.Router();
const { getAll, create, update, remove ,getOne} = require('../controllers/productController');
const { verifyAdmin } = require('../middlewares/auth');  

router.get('/', getAll);                       // chỉ admin
router.get('/:id', getOne)
router.post('/', verifyAdmin, create);        // chỉ admin
router.put('/:id', verifyAdmin, update);      // chỉ admin
router.delete('/:id', verifyAdmin, remove);   // chỉ admin

module.exports = router;