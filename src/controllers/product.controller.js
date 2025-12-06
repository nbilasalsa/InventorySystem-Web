const prisma = require('../config/db');

const listProducts = async (req, res, next) => {
  try {

    // pagination
    const page = Math.max(parseInt(req.query.page || '1',10), 1);
    const limit = Math.min(parseInt(req.query.limit || '10',10), 50);
    const skip = (page - 1) * limit;

    // filter and search
    const { category, q, sortBy = 'createdAt', order = 'desc', minPrice, maxPrice } = req.query;

    const where = {};
    if (category) where.category = { name: { contains: category, mode: 'insensitive' } };
    if (q) where.OR = [
      { name: { contains: q, mode: 'insensitive' }},
      { description: { contains: q, mode: 'insensitive' }},
      { sku: { contains: q, mode: 'insensitive' }}
    ];
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { category: true, stocks: { include: { warehouse: true } } },
        orderBy: { [sortBy]: order === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limit
      })
    ]);

    res.json({
      success:true,
      message:'Products list',
      data: items,
      pagination: {
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (err) { next(err); }
};

const getProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, stocks: { include: { warehouse: true } } }
    });
    if (!product) return res.status(404).json({ success:false, message:'Product not found' });
    res.json({ success:true, message:'Product detail', data: product });
  } catch (err) { next(err); }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, sku, description, price: parseFloat(price), categoryId }
    });
    res.status(201).json({ success:true, message:'Product created', data: product });
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);

    // ownership check if needed; for product maybe Admin or Owner (owner concept optional for this app)
    const existing = await prisma.product.findUnique({ where: { id }});
    if (!existing) return res.status(404).json({ success:false, message:'Not found' });

    const data = req.body;
    if (data.price) data.price = parseFloat(data.price);
    const updated = await prisma.product.update({ where: { id }, data });
    res.json({ success:true, message:'Product updated', data: updated });
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    await prisma.product.delete({ where: { id }});
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };