import {Sever} from "socket.io"

import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)
const io = new Server(server , {
    cors: {
        origin: process.env.URL_CLIENT || "http://localhost:5173",
        Credentials: true
    }
})

io.on("connection" , (socket) => {
    console.log("a user connected : " + socket.id)
    socket.on("disconnect" , () => {
        console.log("user disconnected : " + socket.id)
    })
})



