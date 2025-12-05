// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/utils/bcrypt' // Pastikan ini sudah dibuat di tahap III

const prisma = new PrismaClient()

async function main() {
  console.log('✨ Start seeding database...')

  // --- 1. Hapus Data (Child -> Parent untuk Idempotency) ---
  await prisma.productSupplier.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleaned.')

  // --- 2. Buat Data User (Parent) ---
  const passwordAdmin = await hashPassword('Admin123!') // Password default Admin
  const passwordUser1 = await hashPassword('User123!') // Password default User
  const passwordUser2 = await hashPassword('User456!')

  // 1 akun Admin (Wajib)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@inventory.com',
      password: passwordAdmin,
      name: 'System Admin',
      role: Role.ADMIN,
    },
  })
  // 3-5 akun Regular User (Wajib)
  const regularUser1 = await prisma.user.create({
    data: {
      email: 'user1@inventory.com',
      password: passwordUser1,
      name: 'Regular User 1',
      role: Role.USER,
    },
  })
  const regularUser2 = await prisma.user.create({
    data: {
      email: 'user2@inventory.com',
      password: passwordUser2,
      name: 'Regular User 2',
      role: Role.USER,
    },
  })
  console.log(`✅ Users created (Admin ID: ${adminUser.id})`)

  // --- 3. Buat Entitas Utama Lain (Category & Supplier) ---
  const categoryElectronics = await prisma.category.create({ data: { name: 'Electronics' } })
  const categoryOffice = await prisma.category.create({ data: { name: 'Office Supplies' } })
  const categoryWarehouse = await prisma.category.create({ data: { name: 'Warehouse Tools' } })

  const supplierA = await prisma.supplier.create({ data: { name: 'Tech Global Inc.', contact: 'support@techglobal.com' } })
  const supplierB = await prisma.supplier.create({ data: { name: 'Office Essentials Ltd.', contact: 'sales@officeessentials.co' } })
  console.log('✅ Categories and Suppliers created.')

  // --- 4. Buat Data Product (Entitas Utama dengan Relasi) ---
  // Minimal 5 records per entitas utama
  const product1 = await prisma.product.create({
    data: {
      name: 'Wireless Mouse Pro',
      sku: 'WM-001-A',
      stock: 150,
      price: 25.99,
      categoryId: categoryElectronics.id,
      userId: adminUser.id, // Dibuat oleh Admin
      status: 'AVAILABLE',
    },
  })
  const product2 = await prisma.product.create({
    data: {
      name: 'A4 Printer Paper 500 Sheets',
      sku: 'PP-500-B',
      stock: 800,
      price: 5.50,
      categoryId: categoryOffice.id,
      userId: regularUser1.id, // Dibuat oleh User 1
      status: 'LOW_STOCK',
    },
  })
  const product3 = await prisma.product.create({
    data: {
      name: 'High Definition Webcam',
      sku: 'HDW-10-C',
      stock: 50,
      price: 59.99,
      categoryId: categoryElectronics.id,
      userId: adminUser.id,
      status: 'AVAILABLE',
    },
  })
  const product4 = await prisma.product.create({
    data: {
      name: 'Safety Goggles',
      sku: 'SG-20-D',
      stock: 250,
      price: 8.99,
      categoryId: categoryWarehouse.id,
      userId: regularUser2.id,
      status: 'AVAILABLE',
    },
  })
  const product5 = await prisma.product.create({
    data: {
      name: 'Ergonomic Keyboard',
      sku: 'EK-101-E',
      stock: 90,
      price: 45.00,
      categoryId: categoryElectronics.id,
      userId: regularUser1.id,
      status: 'AVAILABLE',
    },
  })
  console.log('✅ Products created.')

  // --- 5. Buat Relasi Many-to-Many (ProductSupplier) ---
  await prisma.productSupplier.createMany({
    data: [
      { productId: product1.id, supplierId: supplierA.id }, // Mouse dari Supplier A
      { productId: product3.id, supplierId: supplierA.id }, // Webcam dari Supplier A
      { productId: product2.id, supplierId: supplierB.id }, // Paper dari Supplier B
      { productId: product5.id, supplierId: supplierA.id },
      { productId: product5.id, supplierId: supplierB.id }, // Keyboard dari A & B
    ],
  })
  console.log('✅ Many-to-Many relations established.')

  console.log('🎉 Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })