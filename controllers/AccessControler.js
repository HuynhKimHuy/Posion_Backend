import { OK } from '../core/Success.js';
import AccessService from '../services/AccessSeverice.js';

const REFRESH_COOKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000;

const isLocalRequest = (req) => {
  const origin = String(req.headers?.origin || '').toLowerCase();
  const host = String(req.headers?.host || '').toLowerCase();
  return (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1')
  );
};

const getRefreshCookieOptions = (req) => {
  const isLocal = isLocalRequest(req);
  return {
    httpOnly: true,
    sameSite: isLocal ? 'lax' : 'none',
    secure: !isLocal,
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: '/',
    // Hỗ trợ trình duyệt mới với cross-site cookie bị siết chặt
    partitioned: !isLocal,
  };
};

class AccessController {

  static signup = async (req, res, next) => {
    new OK({
      message: "ok",
      statusCode: 200,
      metadata: await AccessService.signup(req.body)
    }).send(res)
  };

  static signin = async (req, res, next) => {
    const metadata = await AccessService.signin(req.body)
    const refreshToken = metadata?.tokens?.refreshToken
    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, getRefreshCookieOptions(req));
    }
    new OK({
      message: "ok",
      statusCode: 200,
      metadata
    }).send(res)
  }

  static logout = async (req, res, next) => {
    const { refreshToken } = req.cookies || {};
    const token = refreshToken || req.body?.refreshToken;
    await AccessService.logout({ token });
    res.clearCookie("refreshToken", getRefreshCookieOptions(req));
    new OK({
      message: "ok",
      statusCode: 200,
      metadata: {}
    }).send(res)
  }

  static refreshToken = async (req, res, next) => {
    const token = req.cookies?.refreshToken
    new OK({
      message: "updatate access token success",
      statusCode: 201,
      metadata: await AccessService.refreshToken({ token })
    }).send(res)

  }
}
export default AccessController
