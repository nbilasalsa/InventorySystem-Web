// File: src/config/db.js (KODE ESM PENUH)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Menggunakan ES Module default export
export default prisma;