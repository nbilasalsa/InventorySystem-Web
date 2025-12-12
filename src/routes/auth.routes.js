import express from 'express';
const router = express.Router();

import * as authControllerModule from '../controllers/auth.controller.js';
const { register, login, refresh, me } = authControllerModule;

import validate from '../middleware/validation.middleware.js';

import * as authValidatorModule from '../validators/auth.validator.js';
const { registerSchema, loginSchema } = authValidatorModule;

import authenticate from '../middleware/auth.middleware.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);

export default router;
