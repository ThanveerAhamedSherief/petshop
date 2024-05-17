const { mongourl } = require("../config/config");
const logger = require("../utils/logGenerator");
const mongoose = require("mongoose");

let gfs1;
let conn;
const connectMongoDb = async () => {
  try {
    console.log("url", mongourl);
    await mongoose.connect(mongourl);
    logger.info("MongoDb connected successfully..!");

  } catch (error) {
    logger.error("Error while connecting to mongodb", error);
    return false;
  }
};

module.exports = {gfs1, conn ,connectMongoDb}