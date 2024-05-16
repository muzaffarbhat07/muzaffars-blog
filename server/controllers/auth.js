import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res) => {
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

export const signin = catchAsync(async (req, res) => {
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

export const google = catchAsync(async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;
  if (!email || !name || !googlePhotoUrl) {
    throw new ExpressError('All fields are required', 400);
  }
  const user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = new User({
      username:
        name.toLowerCase().split(' ').join('') +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  }
});

export const signout = (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json('User has been signed out');
};