import { ensureUnreadCountsMap, normalizeUnreadCounts } from "./unreadCounts.js"

const updateConverStationAfteCreateMessage = (conversation, message, senderId) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt
        }
    })

    const senderIdString = senderId?.toString()
    const unreadCounts = ensureUnreadCountsMap(conversation)

    conversation.participants.forEach((participant) => {
        const memberId = participant?.userId?.toString?.() || participant?.toString?.()
        if (!memberId) return

        const isSender = memberId === senderIdString
        const prevCount = unreadCounts.get(memberId) || 0
        unreadCounts.set(memberId, isSender ? 0 : prevCount + 1)
    })
}

export const emitNewMessage = (io, conversation, message) => {
    if (!io || !conversation?._id || !message?._id) return

    const conversationId = conversation._id.toString()
    const unreadCounts = normalizeUnreadCounts(conversation.unreadCounts)

    const payload = {
        message,
        conversation: {
            _id: conversation._id,
            type: conversation.type,
            name: conversation.name,
            group: conversation.group,
            participants: conversation.participants,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
            seenBy: conversation.seenBy,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            unreadCounts,
        },
        unreadCounts,
    }

    io.to(conversationId).emit("new-message", payload)

    const participantIds = (conversation.participants || [])
        .map((participant) => participant?.userId?.toString?.() || participant?.userId)
        .filter(Boolean)

    participantIds.forEach((userId) => {
        io.to(`user:${userId}`).emit("new-message", payload)
    })
}
export default updateConverStationAfteCreateMessage
