const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');  

router.get('/', productCtrl.listProducts);
router.get('/:id', productCtrl.getProduct);
router.post('/', authenticate, authorize(['ADMIN']), productCtrl.createProduct); // hanya admin bisa membuat produk
router.put('/:id', authenticate, authorize(['ADMIN']), productCtrl.updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), productCtrl.deleteProduct);

module.exports = router;