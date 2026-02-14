import { BadRequestError } from "../core/AppError";
import User from "../models/User.js";
import Friend from '../models/Friend.js'
import FriendRequestModel from "../models/FriendRequest";
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

    if (request.to.toString() != userId) throw new Error("Không có quyền chấp nhận lời mời kết bạn ");

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    })

  };
  static declineFriendRquest = async (userId) => {

  };
}

export default FriendService;
