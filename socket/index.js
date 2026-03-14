import { Server } from "socket.io"
import SocketMiddleware from "../middleware/socketMiddleware.js";
import http from "http"
import express from "express"
import ConversationService from "../services/ConversationService.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.URL_CLIENT || "http://localhost:5173",
        credentials: true
    }
})

global.io = io

io.use(SocketMiddleware)

const onlineUser = new Map()

io.on("connection", async (socket) => {
    const user = socket.user
    const username = user?.userName || user?.username || "unknown-user"
    socket.join(`user:${user.id}`)
    onlineUser.set(user.id, socket.id)
    console.log("Socket connected : " + username + " (" + socket.id + ")")

    // Gửi riêng cho client vừa connect để tránh race condition
    socket.emit("online-users", Array.from(onlineUser.keys()))
    // Thông báo cho tất cả các client khác
    socket.broadcast.emit("online-users", Array.from(onlineUser.keys()))

    const conversationIds = await ConversationService.getUserConversationsForSocket(user.id)
    conversationIds.forEach(conversationId => {
        socket.join(conversationId)
        console.log(`Joining socket ${socket.id} to conversation ${conversationId}`)
    })



    socket.on("disconnect", () => {
        onlineUser.delete(user.id)
        console.log("Socket disconnected : " + username + " (" + socket.id + ")")
        io.emit("online-users", Array.from(onlineUser.keys()))
    }
    )
})

export { io, server, app }


