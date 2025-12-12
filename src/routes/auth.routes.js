// src/routes/auth.routes.js (KODE PERBAIKAN)

import express from 'express';
const router = express.Router();

// Ini mungkin perlu diubah juga jika auth.controller.js masih CommonJS
import * as authControllerModule from '../controllers/auth.controller.js';
const { register, login, refresh, me } = authControllerModule;

import validate from '../middleware/validation.middleware.js';

// Ini mungkin perlu diubah juga jika auth.validator.js masih CommonJS
import * as authValidatorModule from '../validators/auth.validator.js';
const { registerSchema, loginSchema } = authValidatorModule; 

// Asumsi auth.middleware.js sudah diubah ke export default
import authenticate from '../middleware/auth.middleware.js'; 

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);

export default router; // <-- Solusi untuk error di index.js