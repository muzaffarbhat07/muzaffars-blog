import express from 'express';
const app = express();
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
/*******************IMPORT ROUTES*******************/
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
/*****************IMPORT ROUTES END******************/


/******************CONNECT DATABASE*****************/
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "muzaffars-blog",
})
.then(() => console.log("Database Connected"))
.catch(err => console.log(err))
/****************CONNECT DATABASE END****************/


/********************REQUIREMENTS********************/
app.use(express.json());
app.use(cookieParser());
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));
/******************REQUIREMENTS END*******************/


/********************START SERVER********************/
const server_port = process.env.SERVER_PORT || 8000;
app.listen(server_port, () => {
  console.log(`Server running on port ${server_port}`)
})
/******************START SERVER END*******************/


/******************CONFIGURE ROUTES*******************/
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
/****************CONFIGURE ROUTES END******************/


/********************GET ALL***************************/
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
/******************GET ALL END*************************/

/******************ERROR HANDLER***********************/
app.use((err, req, res, next) => {
  const { message = 'Something went wrong.', statusCode = 500 } = err;
  if(typeof(message) !== 'string') {
    message = JSON.stringify(message)
  }
  res.status(statusCode).json({
    error: message,
    success: false,
  });
})
/****************ERROR HANDLER END**********************/