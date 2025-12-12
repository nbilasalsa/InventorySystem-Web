import prisma from '../config/db.js'
import { success, error } from "../utils/response.js";

export async function getWarehouses(req, res) {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: { stocks: true },
    });
    return success(res, "Warehouses fetched successfully", warehouses);
  } catch (err) {
    return error(res, "Failed to fetch warehouses", err.message, 500);
  }
}

export async function getWarehouseById(req, res) {
  try {
    const { id } = req.params;
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: Number(id) },
      include: { stocks: true },
    });

    if (!warehouse) return error(res, "Warehouse not found", null, 404);

    return success(res, "Warehouse fetched successfully", warehouse);
  } catch (err) {
    return error(res, "Failed to fetch warehouse", err.message, 500);
  }
}

export async function createWarehouse(req, res) {
  try {
    const { name, location } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: { name, location },
    });

    return success(res, "Warehouse created successfully", warehouse, null, 201);
  } catch (err) {
    return error(res, "Failed to create warehouse", err.message, 500);
  }
}

export async function updateWarehouse(req, res) {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id: Number(id) },
      data: { name, location },
    });

    return success(res, "Warehouse updated successfully", warehouse);
  } catch (err) {
    return error(res, "Failed to update warehouse", err.message, 500);
  }
}

export async function deleteWarehouse(req, res) {
  try {
    const { id } = req.params;

    await prisma.warehouse.delete({
      where: { id: Number(id) },
    });

    return success(res, "Warehouse deleted successfully");
  } catch (err) {
    return error(res, "Failed to delete warehouse", err.message, 500);
  }
} 