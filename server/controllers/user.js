import bcrypt from 'bcrypt';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/user.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    throw new ExpressError('You are not allowed to update this user', 403);
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      throw new ExpressError('Password must be at least 6 characters', 400);
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      throw new ExpressError('Username must be between 7 and 20 characters', 400);
    }
    if (req.body.username.includes(' ')) {
      throw new ExpressError('Username cannot contain spaces', 400);
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      throw new ExpressError('Username must be lowercase', 400);
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      throw new ExpressError('Username can only contain letters and numbers', 400);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  }
});