import Comment from '../models/comment.js';
import ExpressError from '../utils/ExpressError.js';
import catchAsync from '../utils/catchAsync.js';

export const createComment = catchAsync(async (req, res) => {
  const { content, postId, userId } = req.body;
  if(!content || !postId || !userId) {
    throw new ExpressError('All fields are required', 400);
  }

  if (userId !== req.user.id) {
    throw new ExpressError('You are not allowed to create this comment', 403);
  }

  const newComment = new Comment({
    content,
    postId,
    userId,
  });
  await newComment.save();

  res.status(200).json(newComment);
});

export const getComments = catchAsync(async (req, res) => {
  if(!req.params.postId) {
    throw new ExpressError('postId missing', 400);
  }
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });
  res.status(200).json(comments);
});