import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import logger from './middleware/logger.middleware.js'; 
import errorHandler from './middleware/error.middleware.js'; 

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger); 

// Health check
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/warehouses', warehouseRoutes);

// 404
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// error handler
app.use(errorHandler); 

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));