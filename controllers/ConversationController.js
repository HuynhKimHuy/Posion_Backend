import ConversationService from "../services/ConversationService.js"
import { OK } from "../core/Success.js"
export const createConversation = async (req, res) => {
    const userId = req.user._id
    new OK({
        message: "Create conversation successfully",
        statusCode: 201,
        metadata: await ConversationService.createConversation(req.body, userId)
    }).send(res)
}

export const getConversations = async (req, res) => {
    const conversations = await ConversationService.getUserConversations(req.user._id);
    
    new OK({
        message: "Get user conversations successfully",
        statusCode: 200,
        metadata: {
            conversations,
            total: conversations.length
        }
    }).send(res)
}

export const getConversationMessages = async (req, res) => {
    const { conversationId } = req.params
    const { limit = 20, cusor } = req.query
    
    new OK({
        message: "Get conversation messages successfully",
        statusCode: 200,
        metadata: await ConversationService.getConversationMessages(conversationId, limit, cusor)
    }).send(res)
}

