import Conversation from "../models/Conversation.js"

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
                path: "lastMessage.sender",
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
                sender: {
                    _id: conv.lastMessage.sender._id,
                    userName: conv.lastMessage.sender.userName,
                    avatarUrl: conv.lastMessage.sender.avatarUrl
                },
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
}

export default ConversationService