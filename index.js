const express = require("express");
const server = express();
const logger = require("./utils/logGenerator");
const { connectMongoDb } = require("./db/connection");
const { port } = require("./config/config");
const cors = require("cors");
const path = require('path');
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoute");
const adminRouter = require("./routes/adminRoute");
const router = require("./routes/route");

const startServer = () => {
  server.use(cors());
  server.use(express.urlencoded({extended:true}))
  server.use(express.json());

  server.use('/api/v1/user', userRouter);
  server.use('/api/v1/post', postRouter);
  server.use('/api/v1/admin', adminRouter);
  server.use('/api/v1/', router);

  server.listen(port, async () => {
    console.log(`Server started at ${port}...!`);
    logger.info(`Server started at ${port}...!`);
    await connectMongoDb();
  });
};
startServer();
