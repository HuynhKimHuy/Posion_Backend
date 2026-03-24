import { Server } from "socket.io"
import SocketMiddleware from "../middleware/socketMiddleware.js";
import http from "http"
import express from "express"
import ConversationService from "../services/ConversationService.js"

const parseOrigins = (...values) => {
    const candidates = values
        .filter(Boolean)
        .flatMap((value) => String(value).split(","))
        .map((origin) => origin.trim())
        .filter(Boolean)

    return [...new Set(candidates)]
}

const allowedOrigins = parseOrigins(
    process.env.URL_CLIENT,
    process.env.URL_CLIENTS,
    "https://posionfrontend.huynhkimhuy69.workers.dev",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
)

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
                return
            }

            callback(new Error(`Origin ${origin} not allowed by CORS`))
        },
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


