import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => {
    return a < b ? [a, b] : [b, a]
}

export const checkFriendship = async (req, res, next) => {
    try {
        const userId = req.user._id.toString()
        const { memberId } = req.body

        if (!memberId || !Array.isArray(memberId)) {
            throw new Error("memberId must be an array");
        }

        // Check friendship with all members
        const friendships = memberId.map(async id => {
            const [userA, userB] = pair(userId, id.toString())
            const friend = await Friend.findOne({
                userA,
                userB,
            })
            return friend ? null : id
        })

        const results = await Promise.all(friendships)
        const notFriend = results.filter(Boolean)
        if (notFriend.length > 0) {
            throw new Error(`You are not friends with users: ${notFriend.join(", ")}`)
        }
        next()
    } catch (error) {
        next(error)
    }
}

