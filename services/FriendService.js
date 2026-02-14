import { BadRequestError } from "../core/AppError.js";
import User from "../models/User.js";
import Friend from '../models/Friend.js'
import FriendRequestModel from "../models/FriendRequest.js";
class FriendService {

  static sendFriendRequest = async (payload) => {
    const { to, message, from } = payload; // from là userId người gửi
    if (!from || !to) throw new BadRequestError("Missing from/to");
    if (from.toString() === to.toString()) throw new BadRequestError("Cannot send request to myself");

    const userExists = await User.exists({ _id: to });
    if (!userExists) throw new BadRequestError("User does not exist");

    let userA = from.toString();
    let userB = to.toString();
    if (userA > userB) [userA, userB] = [userB, userA];

    const [alreadyFriend, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequestModel.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriend) throw new BadRequestError("Already friends");
    if (existingRequest) throw new BadRequestError("Friend request already exists");

    const request = await FriendRequestModel.create({
      from,
      to,
      message: message,
    });

    return request;
  };

  static acceptFriendRequest = async (payload) => {
    const { requestId, userId } = payload
    const request = await FriendRequestModel.findById(requestId)
    if (!request) throw new BadRequestError("Cannot find Request add friend")

    if (request.to.toString() != userId.toString()) throw new Error("Không có quyền chấp nhận lời mời kết bạn ");

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    })

    await FriendRequestModel.findByIdAndDelete(requestId)

    const from = await User.findById(request.from).select(" _id userName avatarUrl").lean()
    return {
      newFriend: {
        _id: from._id,
        userName: from?.userName,
        avatarUrl: from?.avatarUrl
    }
  }
  };

  static declineFriendRequest = async (payload) => {
    const {requestId,userId} = payload
    const request = await FriendRequestModel.findById(requestId)

    if (!request) throw new BadRequestError("Cannot find Request add friend")

    if (request.to.toString() != userId) throw new Error("Không có quyền từ chối lời mời kết bạn ");
    await FriendRequestModel.findByIdAndDelete(requestId)
  };

  static getAllFriends = async (userId) => {
    const friends = await Friend.find({
      $or: [
        { userA: userId },
        { userB: userId },
      ],
    }).populate("userA userB", "_id userName avatarUrl").lean();
    if (!friends.length) throw new BadRequestError("Cannot find friends");
    if (friends.length > 0) {
      return friends.map(friend => {
        const friendInfo = friend.userA._id.toString() === userId.toString() ? friend.userB : friend.userA; 
        return {
          ...friend,
          friendInfo
        }
      });
    }
  }
}

export default FriendService;
