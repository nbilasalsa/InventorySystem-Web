import prisma from '../config/db.js'; 
import * as responseModule from '../utils/response.js';
const { success, error } = responseModule.default || responseModule; 


export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { products: true },
        });
        return success(res, "Categories fetched successfully", categories);
    } catch (err) {
        return error(res, "Failed to fetch categories", err.message, 500);
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: { products: true },
        });

        if (!category) return error(res, "Category not found", null, 404);

        return success(res, "Category fetched successfully", category);
    } catch (err) {
        return error(res, "Failed to fetch category", err.message, 500);
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await prisma.category.create({
            data: { name, description },
        });

        return success(res, "Category created successfully", category, null, 201);
    } catch (err) {
        if (err.code === 'P2002') {
            return error(res, 'Category name already exists', null, 409);
        }
        return error(res, "Failed to create category", err.message, 500);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: { name, description },
        });

        return success(res, "Category updated successfully", category);
    } catch (err) {
        if (err.code === 'P2002') {
            return error(res, 'Category name already exists', null, 409);
        }
        return error(res, "Failed to update category", err.message, 500);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.category.delete({
            where: { id: Number(id) },
        });

        return success(res, "Category deleted successfully");
    } catch (err) {
        return error(res, "Failed to delete category", err.message, 500);
    }
};