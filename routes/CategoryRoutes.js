import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCatoagaryController, singleCategoryController, updateCategoryController } from "../controllers/CategoryController.js";

const router = express.Router()

// category router
router.post("/create-category", requireSignIn, isAdmin, createCategoryController)

// category Update
router.put("/create-category/:id", requireSignIn, isAdmin, updateCategoryController)

// get All Categorys
router.get("/get-category", categoryController)

// Single Category
router.get("/single-category/:slug", singleCategoryController)  // Here you can also add :id  your wish as per your requirement

// delete Category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCatoagaryController)

export default router
