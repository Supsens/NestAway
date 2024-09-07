import express from "express";
import dotenv from "dotenv"
dotenv.config();
import cookieParser from "cookie-parser";
import { Connect } from "./utils/db.js";
import { UserRouter } from "./routes/user.routes.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { listingrouter } from "./routes/listing.routes.js";
const PORT=process.env.PORT||3000;

const app=express();
app.use(express.json())
app.use(cookieParser())
app.use("/api/user",UserRouter)
app.use("/api/auth",AuthRouter)
app.use("/api/listing",listingrouter)
app.listen(PORT,()=>{
    console.log('Server is Running on port '+PORT);
    Connect()
})

app.use((err,req,res,next)=>{
const statusCode=err.statusCode||500;

const message=err.message||'Internal Server Error';
return res.status(statusCode).json({
    success:false,
    statusCode,
    message,
})
})