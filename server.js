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
import path from 'path'
import { fileURLToPath } from "url";

//Configure env to call
dotEnv.config()

// databse config or connect
connectDB()

//ES Modules fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, "./client/build")))

// rest object create

//routes
app.use("/api/v1/auth", authRoutes)   // npm run dev

// routes for Category

app.use("/api/v1/category", CategoryRoutes)

//routes for product 

app.use("/api/v1/product", ProductRoutes)

//rest api
// app.get('/', (req, res) => {
//     res.send("<h1>Welcome to Ecommer App</h1>")
// })

app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

//PORT
const PORT = process.env.PORT || 8080;  // Here Every Details will contain in dotEnv file 

//run listen
app.listen(PORT, () => {
    console.log(`Server Runnung on ${process.env.DEV_MODE} mode ${PORT}`.bgCyan.white);
});
