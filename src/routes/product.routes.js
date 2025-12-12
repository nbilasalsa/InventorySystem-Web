// src/routes/product.routes.js (KODE PERBAIKAN ESM KOMPATIBILITAS)

import express from 'express';
const router = express.Router();

// --- Perbaikan Import untuk CommonJS/Export Tidak Konsisten ---

// 1. Controller: Gunakan import * as untuk mengakses named/default export CommonJS
import * as productControllerModule from '../controllers/product.controller.js';
const productCtrl = productControllerModule.default || productControllerModule; // Mengambil object controller

// 2. Middleware: Gunakan import * as untuk mengakses authenticate
import * as authMiddleware from '../middleware/auth.middleware.js';
const authenticate = authMiddleware.default; 

// 3. Middleware: Gunakan import * as untuk mengatasi error 'default' pada authorize (INI SOLUSI UNTUK ERROR SAAT INI)
import * as roleMiddleware from '../middleware/role.middleware.js';
const authorize = roleMiddleware.default; 
// Kita akan menggunakan authorize(['ADMIN']) langsung di route, seperti sebelumnya.

// --- AKHIR PERBAIKAN ---


router.get('/', productCtrl.listProducts);
router.get('/:id', productCtrl.getProduct);
// Pastikan authorize(['ADMIN']) dipanggil (karena authorize adalah fungsi)
router.post('/', authenticate, authorize(['ADMIN']), productCtrl.createProduct); 
router.put('/:id', authenticate, authorize(['ADMIN']), productCtrl.updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), productCtrl.deleteProduct);

// Menggunakan ES Module default export
export default router;