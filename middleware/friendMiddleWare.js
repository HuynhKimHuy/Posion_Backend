import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => {
    return a < b ? [a, b] : [b, a]
}

export const checkFriendship = async (req, res, next) => {
    const { recipientId } = req.body// Lấy userId từ req.user;
    const userId = req.user._id.toString()
    const memberIds = req.body?.memberId || []


    if (recipientId) {
        const [userA, userB] = pair(userId, recipientId)
        const friendship = await Friend.findOne({
            userA,
            userB,
        })
        if (!friendship && memberIds.length === 0) {
            throw new Error("You are not friends with this user.")
        }
        return next()
    }

    const friendships = memberIds.map(async id => {
        const [userA, userB] = pair(userId, id)
        const friend = await Friend.findOne({
            userA,
            userB,
        })
        return friend ? null : memberIds
    })

    const results = await Promise.all(friendships)
    const notFriend = results.filter(Boolean)
    if (notFriend.length > 0) {
        throw new Error(`You are not friends with users: ${notFriend.join(", ")}`)
    }
    next()

}  