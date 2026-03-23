import { OK } from "../core/Success.js";
import UserService from "../services/UserService.js";

class UserController {
  static fetchUserInfo = async (req, res, next) => {
    const userId = req.user._id;

    new OK({
      message: "fetch user info success",
      statusCode: 200,
      metadata: await UserService.fetchUserInfo({ userId }),
    }).send(res);
  };

  static updateUserInfo = async (req, res, next) => {
    const userId = req.user._id;

    new OK({
      message: "update user info success",
      statusCode: 200,
      metadata: await UserService.updateUserInfo({ userId, ...req.body }),
    }).send(res);
  };
}

export default UserController;
