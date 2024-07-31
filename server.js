import express from "express";
import colors from "colors"; // for text color
import dotEnv from "dotenv";
import morgan from "morgan";
// import mongoose from "mongoose"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import CategoryRoutes from "./routes/CategoryRoutes.js"
import ProductRoutes from "./routes/ProductRoutes.js"
import cors from "cors"

//Configure env to call
dotEnv.config()

// databse config or connect
connectDB()

//ES Modules fix
const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// rest object create

//routes
app.use("/api/v1/auth", authRoutes)   // npm run dev

// routes for Category

app.use("/api/v1/category", CategoryRoutes)

//routes for product 

app.use("/api/v1/product", ProductRoutes)


//PORT
const PORT = process.env.PORT || 8080;  // Here Every Details will contain in dotEnv file 

//run listen
app.listen(PORT, () => {
    console.log(`Server Runnung on ${process.env.DEV_MODE} mode ${PORT}`.bgCyan.white);
});
