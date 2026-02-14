
import { OK } from "../core/Success.js";

import FriendService from "../services/FriendService.js";


export const sendFriendRequest = async (req, res) => {
    const from = req.user?._id;
    new OK({
        message: "send request OK ",
        statusCode: 200,
        metadata: await FriendService.sendFriendRequest({
            ...req.body,
            from,
        })
    }).send(res)

};

export const accepFriendRequest = async (req, res) => {
    const { requestId } = req.params
    const userId = req.user?._id;
    new OK({
        message: "acceppt Request completed",
        statusCode: 200,
        metadata: await FriendService.acceptFriendRequest({
            requestId,
            userId
        })
    }).send(res)
};
export const declineFriendRequest = async (req, res) => {
    const { requestId } = req.params
    const userId = req.user?._id;
    new OK({
        message: "decline Request completed",
        statusCode: 200,
        metadata: await FriendService.declineFriendRequest({
            requestId,
            userId
        })
    }).send(res)

};
export const getAllFriends = async (req, res) => {
    const userId = req.user?._id;
    new OK({
        message: "get all friends completed",
        statusCode: 200,
        metadata: await FriendService.getAllFriends(userId)
    }).send(res)

};
export const getAllFriendRequest = async (req, res) => {

};
