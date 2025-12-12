// File: src/routes/warehouse.routes.js (KODE PERBAIKAN FINAL)

import express from 'express';
const router = express.Router();

// --- Import Controller (Menggunakan Named Export dari Controller yang sudah di-fix) ---
import { 
    getWarehouses, 
    getWarehouseById, 
    createWarehouse, 
    updateWarehouse, 
    deleteWarehouse 
} from '../controllers/warehouse.controller.js';

// --- Import Middleware (Menggunakan Default Export setelah perbaikan) ---
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js'; 
const admin = authorize(['ADMIN']);

// --- Definisi Rute ---

router.get('/', getWarehouses); 
router.get('/:id', getWarehouseById);

router.post('/', authenticate, admin, createWarehouse); 
router.put('/:id', authenticate, admin, updateWarehouse);
router.delete('/:id', authenticate, admin, deleteWarehouse);

export default router;