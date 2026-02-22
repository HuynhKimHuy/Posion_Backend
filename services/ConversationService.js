import Conversation from "../models/Conversation.js"
import message from "../models/message.js"
import { BadRequestError } from "../core/AppError.js"
class ConversationService {
    static async createConversation(payload, currentUserId) {
        const { type, name, memberId } = payload

        if (!currentUserId) {
            throw new BadRequestError("Unauthorized")
        }

        if (!type) {
            throw new BadRequestError("Missing type")
        }

        if (!Array.isArray(memberId) || memberId.length < 1) {
            throw new BadRequestError("memberId must be an array")
        }

        let conversation

        if (type === "group") {
            if (!name) {
                throw new BadRequestError("Group name required")
            }

            const uniqueMembers = [
                ...new Set([...memberId.map(String), String(currentUserId)])
            ]

            conversation = new Conversation({
                type: "group",
                name,
                createdBy: currentUserId,
                participants: uniqueMembers.map(id => ({
                    userId: id,
                    role: id === String(currentUserId) ? "admin" : "member",
                    joinedAt: new Date()
                })),
                lastMessage: null
            })
        }

        if (type === "direct") {
            if (memberId.length !== 1) {
                throw new BadRequestError("Direct chat requires exactly 1 other user")
            }

            const allMembers = [String(currentUserId), String(memberId[0])]

            conversation = await Conversation.findOne({
                type: "direct",
                participants: { $size: 2 },
                $and: allMembers.map(id => ({
                    participants: { $elemMatch: { userId: id } }
                }))
            })

            if (!conversation) {
                conversation = new Conversation({
                    type: "direct",
                    participants: allMembers.map(id => ({
                        userId: id,
                        role: "member",
                        joinedAt: new Date()
                    })),
                    lastMessage: null
                })
            }
        }

        await conversation.save()

        return conversation
    }

    static async getUserConversations(userId) {
        const conversations = await Conversation.find({
            "participants.userId": userId
        })
            .sort({ updatedAt: -1 })
            .populate({
                path: "participants.userId",
                select: "userName email avatarUrl",
                options: { lean: true }
            })
            .populate({
                path: "lastMessage.senderId",
                select: "userName email avatarUrl",
                options: { lean: true }
            })
            .populate({
                path: "seenBy",
                select: "userName email avatarUrl",
                options: { lean: true }
            })
            .lean()

        // Format dữ liệu trả về
        return conversations.map(conv => ({
            _id: conv._id,
            type: conv.type,
            name: conv.name || null,
            createdBy: conv.createdBy,
            participants: conv.participants.map(p => ({
                userId: p.userId._id,
                userName: p.userId.userName,
                email: p.userId.email,
                avatarUrl: p.userId.avatarUrl,
                role: p.role,
                joinedAt: p.joinedAt
            })),
            lastMessage: conv.lastMessage ? {
                _id: conv.lastMessage._id,
                content: conv.lastMessage.content,
                sender: conv.lastMessage.senderId ? {
                    _id: conv.lastMessage.senderId._id,
                    userName: conv.lastMessage.senderId.userName,
                    avatarUrl: conv.lastMessage.senderId.avatarUrl
                } : null,
                createdAt: conv.lastMessage.createdAt
            } : null,
            seenBy: conv.seenBy ? conv.seenBy.map(user => ({
                _id: user._id,
                userName: user.userName,
                avatarUrl: user.avatarUrl
            })) : [],
            updatedAt: conv.updatedAt,
            createdAt: conv.createdAt
        }))
    }

    static async getConversationMessages(conversationId, limit = 20, cursor) {
        const query = { conversation: conversationId }
        
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) }
        }
        let messages = await message.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) + 1)
        let nextCursor = null

        if (messages.length > limit) {
            const  lastMessage = messages[messages.length - 1]
            nextCursor = lastMessage.createdAt.toISOString()
            messages.pop()
        }
        messages = messages.reverse()
        return {
            messages,
            nextCursor
        }
    }
}

export default ConversationService