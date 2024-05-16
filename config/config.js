const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  mongourl: process.env.MONGOURL,
  port: process.env.PORT,
  secretkey: process.env.SECRET_KEY,
  default_email:process.env.DEFAULT_GMAIL,
  default_password:process.env.DEFAULT_PASSWORD,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
};
