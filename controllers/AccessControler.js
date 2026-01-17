import { OK } from '../core/Success.js';
import AccessService from '../services/AccessSeverice.js';

class AccessController {

  static signup = async (req, res, next) => {
    new OK({
      message:"ok",
      statusCode:200,
      metadata: await AccessService.signup(req.body)
    }).send(res)
  };
  
  static signin = async(req,res,next)=>{
    new OK({
      message:"ok",
      statusCode:200,
      metadata: await AccessService.signin(req.body)
    }).send(res)
  }

  static logout = async(req,res,next)=>{
    const { refreshToken } = req.cookies || {};
    await AccessService.logout({ token: refreshToken });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
  }
}
export default AccessController
