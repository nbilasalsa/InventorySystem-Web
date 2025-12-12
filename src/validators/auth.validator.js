// File: src/validators/auth.validator.js (KODE PERBAIKAN ESM)

// 1. Mengganti require('joi') dengan import
import Joi from 'joi'; 

// Skema tetap sama, tetapi kita menggunakan export const:

export const registerSchema = Joi.object({
    // Asumsi role di database sekarang adalah String, bukan Enum
    role: Joi.string().valid('USER', 'ADMIN').default('USER').optional(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// Catatan: Hapus module.exports di akhir