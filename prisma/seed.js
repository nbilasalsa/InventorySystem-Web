import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('Clearing old data...');
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await cleanDatabase();

  // user n admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@mail.com',
      password: adminPassword, 
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      username: 'user01',
      email: 'user01@mail.com',
      password: userPassword,
      name: 'Regular Staff',
      role: 'USER',
    },
  });

  // category
  const category1 = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Gadgets and components',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Consumables',
      description: 'Office supplies',
    },
  });

  // warehouse
  const warehouseA = await prisma.warehouse.create({
    data: { name: 'Main Warehouse A', location: 'Jakarta' },
  });

  const warehouseB = await prisma.warehouse.create({
    data: { name: 'Branch Warehouse B', location: 'Surabaya' },
  });

  // produk n stok
  await prisma.product.create({
    data: {
      name: 'Monitor LED 27"',
      sku: 'EL-MON-001',
      price: 250.0,
      description: 'High-resolution monitor',
      categoryId: category1.id,
      stocks: {
        create: [
          { warehouseId: warehouseA.id, quantity: 50 },
          { warehouseId: warehouseB.id, quantity: 20 },
        ],
      },
    },
  });

  console.log('✅ Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
