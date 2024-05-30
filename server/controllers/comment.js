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

export const likeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    throw new ExpressError('Comment not found', 404);
  }
  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex === -1) {
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.id);
  } else {
    comment.numberOfLikes -= 1;
    comment.likes.splice(userIndex, 1);
  }
  await comment.save();
  res.status(200).json(comment);
});