import Conversation from "../models/Conversation.js"

class ConversationService {
    static async createConversation(payload) {
        const { type, name, memberId } = payload
        if (!type || (type === "group" && !name) || !memberId || memberId.length < 2) {
            throw new BadRequestError("Missing required fields")
        }

        let conversation
        if (type === "direct") {
            conversation = await Conversation.findOne({
                type: "direct",
                participants: { $size: 2 },
                $and: memberId.map(id => ({
                    participants: {
                        $elemMatch: { userId: id }
                    }
                }))
            })
            if (!conversation) {
                conversation = new Conversation({
                    type: "direct",
                    participants: memberId.map(id => ({ userId: id, joinedAt: new Date() })),
                    lastmessage: new Date(),
                })
            }
        }
        if (type === "group") {

            const creatorId = payload.createdBy

            const uniqueMembers = [
                ...new Set([...memberId, creatorId.toString()])
            ]

            conversation = new Conversation({
                type: "group",
                name,
                createdBy: creatorId,
                participants: uniqueMembers.map(id => ({
                    userId: id,
                    role: id === creatorId.toString() ? "admin" : "member",
                    joinedAt: new Date()
                })),
                lastMessage: null
            })
        }
        await conversation.save()
        await conversation.populate([
            {
                path : "participants.userId",
                select : "username email avatar"
            },
            {
                path: "createdBy",
                select: "displayName avatarUrl"
            }
        ])
        return conversation
    }
}

export default ConversationService