import { BadGatewayError } from "../core/AppError.js";
import Message from "../models/message.js";

import Conversation from "../models/Conversation.js";
import updateConverStationAfteCreateMessage, { emitNewMessage } from "../helpers/messageHelper.js";
import { normalizeUnreadCounts } from "../helpers/unreadCounts.js";

const toRealtimeConversationPayload = async (conversationId) => {
    const conv = await Conversation.findById(conversationId)
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

    if (!conv) return null

    return {
        _id: conv._id.toString(),
        type: conv.type,
        name: conv.type === "group" ? conv.group?.name || null : null,
        group: conv.group ? {
            name: conv.group.name,
            createdBy: conv.group.createdBy?.toString?.() || conv.group.createdBy,
        } : null,
        participants: (conv.participants || []).map((p) => ({
            userId: p.userId?._id?.toString?.() || p.userId?.toString?.() || p.userId,
            userName: p.userId?.userName,
            displayName: `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim() || p.userId?.userName,
            email: p.userId?.email,
            avatarUrl: p.userId?.avatarUrl || null,
            role: p.role,
            joinedAt: p.joinedAt,
        })),
        lastMessageAt: conv.lastMessageAt,
        lastMessage: conv.lastMessage ? {
            _id: conv.lastMessage._id?.toString?.() || conv.lastMessage._id,
            content: conv.lastMessage.content,
            sender: conv.lastMessage.senderId ? {
                _id: conv.lastMessage.senderId._id?.toString?.() || conv.lastMessage.senderId._id,
                userName: conv.lastMessage.senderId.userName,
                displayName: `${conv.lastMessage.senderId.firstName || ""} ${conv.lastMessage.senderId.lastName || ""}`.trim() || conv.lastMessage.senderId.userName,
                avatarUrl: conv.lastMessage.senderId.avatarUrl || null,
            } : null,
            createdAt: conv.lastMessage.createdAt,
        } : null,
        seenBy: (conv.seenBy || []).map((user) => ({
            _id: user._id?.toString?.() || user._id,
            userName: user.userName,
            displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName,
            avatarUrl: user.avatarUrl || null,
        })),
        unreadCounts: normalizeUnreadCounts(conv.unreadCounts),
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
    }
}

const toRealtimeMessagePayload = (messageDoc) => ({
    _id: messageDoc._id?.toString?.() || messageDoc._id,
    conversationId: messageDoc.conversation?.toString?.() || messageDoc.conversation,
    senderId: messageDoc.senderId?.toString?.() || messageDoc.senderId,
    content: messageDoc.content ?? null,
    imgUrl: messageDoc.imgUrl ?? null,
    createdAt: messageDoc.createdAt,
    updatedAt: messageDoc.updatedAt,
})

class messageService {
    static async sendDirectMessage(payload) {
        const { senderId, recipientId, content, conversationId } = payload;

        let conversation
        if (!content) throw new BadGatewayError("Content is required")

        if (conversationId) {
            conversation = await Conversation.findById(conversationId)
            if (!conversation) {
                throw new BadGatewayError("Conversation not found")
            }

            if (conversation.type !== "direct") {
                throw new BadGatewayError("Conversation is not direct type")
            }
        }

        if (!conversation) {
            if (!recipientId) {
                throw new BadGatewayError("recipientId is required")
            }

            const directMembers = [String(senderId), String(recipientId)]

            conversation = await Conversation.findOne({
                type: "direct",
                participants: { $size: 2 },
                $and: directMembers.map((id) => ({
                    participants: { $elemMatch: { userId: id } }
                }))
            })
        }

        if (!conversation) {
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() }
                ],
                lastMessageAt: null,
                unreadCounts: new Map()
            })
        }

        const message = await Message.create({
            conversation: conversation._id,
            senderId,
            content
        })

        if (!message) throw new BadGatewayError("Failed to create message")
        updateConverStationAfteCreateMessage(conversation, message, senderId)
        await conversation.save()

        const realtimeConversation = await toRealtimeConversationPayload(conversation._id)
        const realtimeMessage = toRealtimeMessagePayload(message)
        emitNewMessage(global.io, realtimeConversation, realtimeMessage)

        return {
            message: realtimeMessage,
            conversation: realtimeConversation,
        }
    }

    static async sendGroupMessage(senderId, conversationId, content) {

        if (!content) throw new BadGatewayError("Content is required")

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) throw new BadGatewayError("Conversation not found")

        const message = await Message.create({
            conversation: conversationId,
            senderId,
            content
        })
        updateConverStationAfteCreateMessage(conversation, message, senderId)
        await conversation.save()

        const realtimeConversation = await toRealtimeConversationPayload(conversation._id)
        const realtimeMessage = toRealtimeMessagePayload(message)
        emitNewMessage(global.io, realtimeConversation, realtimeMessage)

        return {
            message: realtimeMessage,
            conversation: realtimeConversation,
        }
    }

}

export default messageService