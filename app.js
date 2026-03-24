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
import { app, server } from "./socket/index.js"
import { v2 as cloudinary } from 'cloudinary';
Database.getInstance()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

app.use(cookieParser());

app.use(helmet())
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
app.use('/', router)

app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)

})

app.use((error, req, res, next) => {
  const isFileTooLarge = error && error.code === "LIMIT_FILE_SIZE";
  const statusCode = isFileTooLarge ? 400 : error.status || 500;
  const message = isFileTooLarge
    ? "File upload too large (max 2MB)"
    : error.message || "Internal sever Error";
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message
  })
})

server.listen(process.env.PORT, () => {
  console.log(`React Lofi runing on PORT ${process.env.PORT}`)
})

