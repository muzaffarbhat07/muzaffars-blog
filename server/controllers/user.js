import bcrypt from 'bcrypt';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/user.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = catchAsync(async (req, res) => {
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
});

export const deleteUser = catchAsync(async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    throw new ExpressError('You are not allowed to delete this user', 403);
  }

  await User.findByIdAndDelete(req.params.userId);
  res.status(200).json('User has been deleted');
});

export const getUsers = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new ExpressError('You are not allowed to see all users', 403);
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === 'asc' ? 1 : -1;

  const users = await User.find()
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const usersWithoutPassword = users.map((user) => {
    const { password, ...rest } = user._doc;
    return rest;
  });

  const totalUsers = await User.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    users: usersWithoutPassword,
    totalUsers,
    lastMonthUsers,
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ExpressError('User not found', 404);
  }
  const { password, ...rest } = user._doc;
  res.status(200).json(rest);
});