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

  static uploadAvatar = async (req, res, next) => {
    const userId = req.user._id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "No file uploaded",
      });
    }
    console.log("[uploadAvatar] userId=", userId, "filename=", file.originalname, "size=", file.size);
    new OK({
      message: "upload avatar success",
      statusCode: 200,
      metadata: await UserService.uploadAvatar({ userId, file }),
    }).send(res);
  }

  static uploadCover = async (req, res, next) => {
    const userId = req.user._id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "No file uploaded",
      });
    }
    new OK({
      message: "upload cover success",
      statusCode: 200,
      metadata: await UserService.uploadCover({ userId, file }),
    }).send(res);
  }
}

export default UserController;
