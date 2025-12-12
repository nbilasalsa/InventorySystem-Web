import prisma from '../config/db.js';
import * as responseModule from '../utils/response.js';

const { success, error } = responseModule.default || responseModule;

export const listProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const skip = (page - 1) * limit;

    const { category, q, sortBy = 'createdAt', order = 'desc', minPrice, maxPrice } = req.query;

    const where = {};

    if (category) {
      where.category = { name: { contains: category, mode: 'insensitive' } };
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          stocks: { include: { warehouse: true } }
        },
        orderBy: { [sortBy]: order === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limit
      })
    ]);

    return success(res, 'Products list', items, {
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stocks: { include: { warehouse: true } }
      }
    });

    if (!product) {
      return error(res, 'Product not found', null, 404);
    }

    return success(res, 'Product detail', product);

  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, categoryId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: parseFloat(price),
        categoryId
      }
    });

    return success(res, 'Product created', product, null, 201);

  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Not found', null, 404);
    }

    const data = req.body;
    if (data.price) {
      data.price = parseFloat(data.price);
    }

    const updated = await prisma.product.update({
      where: { id },
      data
    });

    return success(res, 'Product updated', updated);

  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    await prisma.product.delete({ where: { id } });

    return success(res, 'Product deleted', null, 204);

  } catch (err) {
    next(err);
  }
};
