import express from "express"
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//creating Routes for register

//router object
const router = express.Router();

//REGISTER || METHOD POST
router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

//test Routes
router.get('/test', requireSignIn, isAdmin, testController)

//Forgot Password || post
router.post('/forgot-password', forgotPasswordController)

// protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

// Protected route for Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

//Update Profile
router.put("/profile", requireSignIn, updateProfileController)

//orders
router.get("/orders", requireSignIn, getOrdersController)

// all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController)

//order status Update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)

export default router;