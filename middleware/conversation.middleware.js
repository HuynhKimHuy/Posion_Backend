// middleware/conversationMiddleware.js
import Conversation from "../models/Conversation.js"
export const getConversation = async (req, res, next) => {
    const conversationId = req.body.conversationId || req.params.conversationId
    if (!conversationId) throw new Error("conversationId required")
    
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new Error("Conversation not found")
    
    // Check user là participant
    const isParticipant = conversation.participants.some(p => 
        p.userId.toString() === req.user._id.toString()
    )
    if (!isParticipant) throw new Error("Forbidden")
    
    req.conversation = conversation
    next()
}