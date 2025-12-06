import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { validateCreateCategory } from "../validators/category.validator.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", validateCreateCategory, createCategory);
router.put("/:id", validateCreateCategory, updateCategory);
router.delete("/:id", deleteCategory);

export default router;