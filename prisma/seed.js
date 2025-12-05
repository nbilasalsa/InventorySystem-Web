import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

  // delete existing in correct order (child -> parent)
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();

  // create users
  const adminPassword = await bcrypt.hash("Admin@12345", saltRounds);
  const userPassword = await bcrypt.hash("User@12345", saltRounds);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin Test",
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: userPassword,
      name: "User One",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      password: userPassword,
      name: "User Two",
      role: "USER",
    },
  });

  // categories
  const cat1 = await prisma.category.create({
    data: { name: "Electronics", description: "Gadgets and devices" },
  });
  const cat2 = await prisma.category.create({
    data: { name: "Office Supplies", description: "Stationery and office items" },
  });
  const cat3 = await prisma.category.create({
    data: { name: "Furniture", description: "Office furniture" },
  });

  // warehouses
  const wh1 = await prisma.warehouse.create({
    data: { name: "Central Warehouse", location: "Makassar" },
  });
  const wh2 = await prisma.warehouse.create({
    data: { name: "Regional Warehouse", location: "Jakarta" },
  });

  // products
  const p1 = await prisma.product.create({
    data: {
      name: "Wireless Mouse",
      sku: "WM-001",
      description: "Ergonomic wireless mouse",
      price: 12.5,
      categoryId: cat1.id,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: "Notebook A5",
      sku: "NB-001",
      description: "A5 ruled notebook",
      price: 2.0,
      categoryId: cat2.id,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: "Office Chair",
      sku: "OC-001",
      description: "Comfortable office chair",
      price: 45.0,
      categoryId: cat3.id,
    },
  });

  // stocks
  await prisma.stock.createMany({
    data: [
      { productId: p1.id, warehouseId: wh1.id, quantity: 100 },
      { productId: p1.id, warehouseId: wh2.id, quantity: 50 },
      { productId: p2.id, warehouseId: wh1.id, quantity: 200 },
      { productId: p3.id, warehouseId: wh2.id, quantity: 20 },
      { productId: p2.id, warehouseId: wh2.id, quantity: 100 },
    ],
  });

  console.log("Seed selesai:", { admin, user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
