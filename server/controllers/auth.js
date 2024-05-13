import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ExpressError('All fields are required', 400);
  }
  const userExists = await User.findOne({
    $or: [{username}, {email}]
  })
  if(userExists) {
    throw new ExpressError('User already exists', 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.json('Signup successful');
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ExpressError('All fields are required', 400);
  }
  
  const validUser = await User.findOne({ email });
  if (!validUser) {
    throw new ExpressError('User not found', 404);
  }
  const validPassword = await bcrypt.compare(password, validUser.password);
  if (!validPassword) {
    throw new ExpressError('Invalid password', 400);
  }
  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

  const { password: pass, ...rest } = validUser._doc;

  res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
    })
    .json(rest);
});