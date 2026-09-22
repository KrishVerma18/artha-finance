import { verifyToken } from '../utils/tokenUtils.js';
import { UserModel } from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check cookies first (secure HttpOnly cookie)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization Bearer header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, {
        message: 'Authentication required. Please sign in to access your financial dashboard.',
        status: 401,
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return sendError(res, {
        message: 'Session has expired or token is invalid. Please sign in again.',
        status: 401,
      });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return sendError(res, {
        message: 'User account not found. Please register or log in again.',
        status: 401,
      });
    }

    req.user = UserModel.sanitize(user);
    req.userId = user._id ? user._id.toString() : user.id;
    next();
  } catch (error) {
    return sendError(res, {
      message: 'Authentication failure. Please re-authenticate.',
      status: 401,
    });
  }
};
