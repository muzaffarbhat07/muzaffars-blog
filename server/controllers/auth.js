import User from '../models/user.js';
import bcrypt from 'bcrypt';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
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