import JWT from "jsonwebtoken";
import User from "../models/User.js";

const SocketMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default SocketMiddleware;