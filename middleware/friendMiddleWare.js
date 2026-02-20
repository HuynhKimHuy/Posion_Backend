import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair=(a,b)=>{
   return a< b? [a,b]:[b,a]
}

 export const checkFriendship = async (req, res, next) => {
    const { recipientId, conversationId } = req.body// Lấy userId từ req.user;
    const userId = req.user._id.toString()

    if(recipientId) {
        const [userA, userB] = pair(userId, recipientId)
        const friendship = await Friend.findOne({
            userA,
            userB,  
        })
        if (!friendship) {
           throw new Error("You are not friends with this user.")
        }
        return next()
    }
    if(!recipientId) throw new Error("RecipientId is required") 
    


}  