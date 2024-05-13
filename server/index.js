import express from 'express';
const app = express();
import mongoose from 'mongoose';
import 'dotenv/config';

/******************CONNECT DATABASE*****************/
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Database Connected"))
.catch(err => console.log(err))
/****************CONNECT DATABASE END****************/


/********************START SERVER********************/
const server_port = process.env.SERVER_PORT || 8000;
app.listen(server_port, () => {
  console.log(`Server running on port ${server_port}`)
})
/******************START SERVER END*******************/
