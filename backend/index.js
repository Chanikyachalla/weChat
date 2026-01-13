import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import MessageRoutes from "./src/routes/message.route.js";
import { connectDb } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"; 

import dotenv from 'dotenv';
dotenv.config();


const app = express();

const PORT= 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
origin:"http://localhost:5173",
credentials:true
}
    
));

app.use("/api/auth" , authRoutes)
app.use("/api/message" , MessageRoutes)

app.get("/",(req,res)=>{
    res.send("hello");
})



app.listen(PORT , ()=>{
    console.log(`server is running at the port${PORT}`);
    connectDb();
})
