import { config } from "dotenv";
config();

import express from "express"
import helmet from "helmet"
import morgan from "morgan";
import Database from "./config/config.db.js";
import router from "./routers/index.js";
// app.js
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors'
import swaggerUi from "swagger-ui-express";
import fs from "fs";

Database.getInstance()
const app = express()
app.use(cookieParser());

app.use(morgan("dev"));
app.use(compression())
app.use(express.json())
app.use(
  cors({
    origin: [
      process.env.URL_CLIENT,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    ],
    credentials: true
  })
);
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

