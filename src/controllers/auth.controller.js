// File: src/controllers/auth.controller.js (KODE PERBAIKAN FINAL ESM)

import prisma from '../config/db.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import * as responseModule from '../utils/response.js'; 
// Asumsi validator sudah ESM Named Exports
import { registerSchema, loginSchema } from '../validators/auth.validator.js'; 
const { success, error } = responseModule.default || responseModule; 


export const register = async (req, res) => {
    try {
        // PERBAIKAN KRITIS: Menambahkan 'name' ke destructuring
        const { username, password, email, name, role = 'USER' } = req.body;
        
        // Asumsi data valid setelah melewati validation.middleware.js
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { 
                username, 
                password: hashedPassword, 
                email, 
                name, // <--- VARIABEL 'name' SEKARANG DIBERIKAN KE PRISMA
                role 
            },
        });

        // Hapus password dari respons
        return success(res, 'User registered successfully', { id: user.id, username: user.username, email: user.email, name: user.name }, null, 201);
    } catch (err) {
        // Asumsi error code P2002 adalah duplicate entry
        if (err.code === 'P2002') {
             return error(res, 'Username or email already exists', null, 409);
        }
        // Pastikan error yang tidak terduga log dan dikirimkan dengan status 500
        console.error("Error during registration:", err);
        return error(res, 'Registration failed', err.message, 500);
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return error(res, 'Invalid username or password', null, 401);

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return error(res, 'Invalid username or password', null, 401);

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        return success(res, 'Login successful', { token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        return error(res, 'Login failed', err.message, 500);
    }
};

export const refresh = async (req, res) => {
    // Logika refresh token
    return error(res, 'Refresh not yet implemented', null, 501);
};

export const me = async (req, res) => {
    try {
        // req.user diset oleh authenticate middleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, email: true, name: true, role: true } // Menambahkan 'name' ke select
        });

        if (!user) return error(res, 'User not found', null, 404);

        return success(res, 'User data fetched successfully', user);
    } catch (err) {
        return error(res, 'Failed to fetch user data', err.message, 500);
    }
};

// Pastikan tidak ada module.exports di akhir