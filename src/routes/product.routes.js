import express from 'express';
const router = express.Router();

import * as productControllerModule from '../controllers/product.controller.js';
const productCtrl = productControllerModule.default || productControllerModule;

import * as authMiddleware from '../middleware/auth.middleware.js';
const authenticate = authMiddleware.default || authMiddleware;

import * as roleMiddleware from '../middleware/role.middleware.js';
const authorize = roleMiddleware.default || roleMiddleware;

router.get('/', productCtrl.listProducts);
router.get('/:id', productCtrl.getProduct);
router.post('/', authenticate, authorize(['ADMIN']), productCtrl.createProduct);
router.put('/:id', authenticate, authorize(['ADMIN']), productCtrl.updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), productCtrl.deleteProduct);

export default router;
