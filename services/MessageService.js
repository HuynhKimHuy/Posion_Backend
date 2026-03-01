import { BadGatewayError } from "../core/AppError.js";
import Message from "../models/message.js";

import Conversation from "../models/Conversation.js";
import updateConverStationAfteCreateMessage from "../helpers/messageHelper.js";
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
        return {
            message
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
        return {
            message
        }
    }

}

export default messageService