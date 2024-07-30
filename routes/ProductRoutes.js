import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, productSearchController, relatedProductControlller, updateProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable"

const router = express.Router()

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// Update Routes
router.put('/update-product/:id', requireSignIn, isAdmin, formidable(), updateProductController)

//get Product
router.get("/get-product", getProductController)

//get Single Product
router.get("/get-product/:slug", getSingleProductController)

//get Photo of Product
router.get("/product-photo/:pid", productPhotoController)

// delete product
router.delete('/delete-product/:id', deleteProductController)

//filter Product
router.post("/product-filters", productFilterController)   // Here We passing POST instead of GET why becouse in HomePage we are passing  values of checked and radio  Right so Because of that 

//product Count
router.get("/product-count", productCountController)

//product per page
router.get("/product-list/:page", productListController)

// search product
router.get("/search/:keyword", productSearchController)

//similar products
router.get("/related-products/:pid/:cid", relatedProductControlller)

//Category wise product
router.get("/product-category/:slug", productCategoryController)

//payment Route
//token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, brainTreePaymentController)

export default router