import express from "express"
import { config } from "dotenv";
import helmet from "helmet"
import morgan from "morgan";
import Database from "./config/config.db.js";
import router from "./routers/index.js";
// app.js
import cookieParser from "cookie-parser";

import compression from "compression";


config();

Database.getInstance()

const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(morgan("dev"));
app.use(compression())

app.use('/',router)




app.use((req,res,next)=>{
      const error = new Error('Not Found')
      error.status = 404
      next(error)
      
})

app.use((error, req,res,next)=>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code: statusCode,
        message:error.message ||"Internal sever Error"
    })
})

app.listen(process.env.PORT,()=>{
      console.log(`React Lofi runing on PORT ${process.env.PORT}`)
})

