import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import { connectDb } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();


const app = express();

const PORT= 7000;

app.listen(PORT , ()=>{
    console.log(`server is running at the port${PORT}`);
    connectDb();
})

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRoutes)

app.get("/",(req,res)=>{
    res.send("hello");
})

