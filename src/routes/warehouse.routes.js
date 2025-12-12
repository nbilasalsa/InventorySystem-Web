import express from 'express';
const router = express.Router();

import * as warehouseControllerModule from '../controllers/warehouse.controller.js';
const {
  getWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} = warehouseControllerModule;

import * as authMiddleware from '../middleware/auth.middleware.js';
const authenticate = authMiddleware.default || authMiddleware;

import * as roleMiddleware from '../middleware/role.middleware.js';
const authorize = roleMiddleware.default || roleMiddleware;
const admin = authorize(['ADMIN']);

router.get('/', getWarehouses);
router.get('/:id', getWarehouseById);
router.post('/', authenticate, admin, createWarehouse);
router.put('/:id', authenticate, admin, updateWarehouse);
router.delete('/:id', authenticate, admin, deleteWarehouse);

export default router;
