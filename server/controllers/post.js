import Post from '../models/post.js';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';

export const create = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new ExpressError('You are not allowed to create a post', 403);
  }
  if (!req.body.title || !req.body.content) {
    throw new ExpressError('Please provide all required fields', 400);
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
});