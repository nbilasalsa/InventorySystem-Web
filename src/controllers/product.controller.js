import prisma from '../config/db.js';
import * as responseModule from '../utils/response.js';

const { success, error } = responseModule.default || responseModule;

export const listProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const skip = (page - 1) * limit;

    const where = {};

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          stocks: { include: { warehouse: true } }
        },
        skip,
        take: limit
      })
    ]);

    return success(res, 'Products list', items, {
      totalRecords: total,
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

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

    if (!name || !sku || !price || !categoryId) {
      return error(res, 'Required fields missing', null, 400);
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: Number(price),
        categoryId: Number(categoryId)
      }
    });

    return success(res, 'Product created', product, null, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Product not found', null, 404);
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.sku !== undefined) updateData.sku = req.body.sku;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.categoryId !== undefined) updateData.categoryId = Number(req.body.categoryId);

    if (Object.keys(updateData).length === 0) {
      return error(res, 'No data provided to update', null, 400);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData
    });

    return success(res, 'Product updated', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({ where: { id } });

    return success(res, 'Product deleted', null, 204);
  } catch (err) {
    next(err);
  }
};
