import jwt from 'jsonwebtoken';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from './catchAsync.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new ExpressError('Unauthorized', 401);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new ExpressError('Unauthorized', 401);
    }
    req.user = user;
    next();
  });
};