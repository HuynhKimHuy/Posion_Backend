import Conversation from "../models/Conversation.js"
import message from "../models/message.js"
import { BadRequestError, ForbiddenError, NotFoundError } from "../core/AppError.js"
import { ensureUnreadCountsMap, normalizeUnreadCounts } from "../helpers/unreadCounts.js"

const mapConversationPayload = (conv) => ({
    _id: conv._id,
    type: conv.type,
    name: conv.type === "group" ? conv.group?.name : null,
    group: conv.group ? {
        name: conv.group.name,
        createdBy: conv.group.createdBy
    } : null,
    participants: (conv.participants || []).map((p) => ({
        userId: p.userId?._id || p.userId,
        userName: p.userId?.userName,
        displayName: `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim() || p.userId?.userName,
        email: p.userId?.email,
        avatarUrl: p.userId?.avatarUrl,
        role: p.role,
        joinedAt: p.joinedAt
    })),
    lastMessage: conv.lastMessage ? {
        _id: conv.lastMessage._id,
        content: conv.lastMessage.content,
        sender: conv.lastMessage.senderId ? {
            _id: conv.lastMessage.senderId._id,
            userName: conv.lastMessage.senderId.userName,
            displayName: `${conv.lastMessage.senderId.firstName || ""} ${conv.lastMessage.senderId.lastName || ""}`.trim() || conv.lastMessage.senderId.userName,
            avatarUrl: conv.lastMessage.senderId.avatarUrl
        } : null,
        createdAt: conv.lastMessage.createdAt
    } : null,
    seenBy: (conv.seenBy || []).map((user) => ({
        _id: user._id,
        userName: user.userName,
        displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName,
        avatarUrl: user.avatarUrl
    })),
    unreadCounts: normalizeUnreadCounts(conv.unreadCounts),
    updatedAt: conv.updatedAt,
    createdAt: conv.createdAt
})

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
                group: {
                    name: name,
                    createdBy: currentUserId
                },
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
                select: "userName email avatarUrl firstName lastName",
                options: { lean: true }
            })
            .populate({
                path: "lastMessage.senderId",
                select: "userName email avatarUrl firstName lastName",
                options: { lean: true }
            })
            .populate({
                path: "seenBy",
                select: "userName email avatarUrl firstName lastName",
                options: { lean: true }
            })
            .lean()

        return conversations.map(mapConversationPayload)
    }


    static async getConversationMessages(conversationId, limit = 20, cursor) {
        const query = { conversation: conversationId }

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) }
        }
        let messages = await message.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) + 1).lean()
        let nextCursor = null

        if (messages.length > limit) {
            const lastMessage = messages[messages.length - 1]
            nextCursor = lastMessage.createdAt.toISOString()
            messages.pop()
        }
        
        messages = messages.reverse()
        return {
            messages,
            nextCursor
        }
    }

    static async getUserConversationsForSocket(userId) {
        return Conversation.find({
            "participants.userId": userId
        }).select("_id").lean().then(conversations => conversations.map(c => c._id.toString()))
    }

    static async markConversationAsRead(conversationId, userId) {
        const userIdString = String(userId)

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            throw new NotFoundError("Conversation not found")
        }

        const isParticipant = (conversation.participants || []).some(
            (participant) => String(participant.userId) === userIdString
        )

        if (!isParticipant) {
            throw new ForbiddenError("You are not a participant of this conversation")
        }

        const unreadCounts = ensureUnreadCountsMap(conversation)
        unreadCounts.set(userIdString, 0)

        const seenBySet = new Set((conversation.seenBy || []).map((id) => id.toString()))
        seenBySet.add(userIdString)
        conversation.seenBy = Array.from(seenBySet)

        await conversation.save()

        const hydratedConversation = await Conversation.findById(conversationId)
            .populate({
                path: "participants.userId",
                select: "userName email avatarUrl firstName lastName",
                options: { lean: true }
            })
            .populate({
                path: "lastMessage.senderId",
                select: "userName email avatarUrl firstName lastName",
                options: { lean: true }
            })
            .populate({
                path: "seenBy",
                select: "userName email avatarUrl firstName lastName",
                options: { lean: true }
            })
            .lean()

        const payload = mapConversationPayload(hydratedConversation)

        if (global.io) {
            global.io.to(String(conversationId)).emit("conversation-read", {
                conversation: payload,
                unreadCounts: payload.unreadCounts,
                readBy: userIdString,
            })
        }

        return payload
    }
}

export default ConversationService