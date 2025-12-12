import { Router } from 'express';

import * as categoryControllerModule from '../controllers/category.controller.js';
const { 
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory 
} = categoryControllerModule;

import * as authMiddleware from '../middleware/auth.middleware.js';
const authenticate = authMiddleware.default || authMiddleware;

import * as roleMiddleware from '../middleware/role.middleware.js';
const authorize = roleMiddleware.default || roleMiddleware;
const admin = authorize(['ADMIN']);

const router = Router();

router.post('/', authenticate, admin, createCategory);
router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategoryById);
router.put('/:id', authenticate, admin, updateCategory);
router.delete('/:id', authenticate, admin, deleteCategory);

export default router;
