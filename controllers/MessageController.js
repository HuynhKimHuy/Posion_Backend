import { OK } from "../core/Success.js";
import messageService from "../services/MessageService.js";
export const sendDirectMessage = async (req, res) => {
    const {recipientId, content , conversationId} = req.body
    new OK({
        message: "Created message successfully",
        statusCode: 200,
        metadata: await messageService.sendDirectMessage({
            senderId: req.user._id,
            recipientId: recipientId,
            content,
            conversationId
        })
    }).send(res)
}

export const sendGroupMessage = async (req, res) => {
    new OK({
        message: "OK",
        statusCode: 200,
        metadata: await messageService.sendGroupMessage(req.body)
    }).send(res)


    new OK({

    }).send(res)
}

