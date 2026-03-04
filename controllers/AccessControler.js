import { OK } from '../core/Success.js';
import AccessService from '../services/AccessSeverice.js';

const REFRESH_COOKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000;

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: REFRESH_COOKIE_MAX_AGE,
  path: '/',
});

class AccessController {

  static signup = async (req, res, next) => {
    new OK({
      message:"ok",
      statusCode:200,
      metadata: await AccessService.signup(req.body)
    }).send(res)
  };
  
  static signin = async(req,res,next)=>{
    const metadata = await AccessService.signin(req.body)
    const refreshToken = metadata?.tokens?.refreshToken
    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());
    }
    new OK({
      message:"ok",
      statusCode:200,
      metadata
    }).send(res)
  }

  static logout = async(req,res,next)=>{
    const { refreshToken } = req.cookies || {};
    const token = refreshToken || req.body?.refreshToken;
    await AccessService.logout({ token });
    res.clearCookie("refreshToken", getRefreshCookieOptions());
    new OK({
      message:"ok",
      statusCode:200,
      metadata: {}
    }).send(res)
  }

  static refreshToken = async(req,res,next)=>{
    const token = req.cookies?.refreshToken 
    new OK({
      message:"updatate access token success",
      statusCode:201,
      metadata :  await AccessService.refreshToken({ token })
    }).send(res)
    
  }
  static fetchUserInfo = async(req,res,next)=>{
    const userId = req.user._id
    new OK({
      message:"fetch user info success",
      statusCode:200,
      metadata :  await AccessService.fetchUserInfo({ userId })
    }).send(res)
  }
}
export default AccessController
