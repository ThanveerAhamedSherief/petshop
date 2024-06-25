const { limit } = require("../config/config");
const { postModel } = require("../models/postModel");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");


const enablePostsToPublic = async (req, res) => {
  try {
    let { status } = req.body;
    let {postId} = req.params;

    // let verifiedStatus = status === 'Approved' ? true : false;
    console.log("PostId",postId, status)
    let updatePost = await  postModel.findByIdAndUpdate(postId,{
        $set:{
            status
        }
    },{new: true}); 
    res
      .status(200)
      .json(customizeResponse(true,"PB_ERROR_CODE_01", "Post updated successfully", updatePost));


  } catch (error) {
    console.log("Error while updaing post status", error)
    res
    .status(200)
    .json(customizeResponse(false,"PB_ERROR_CODE_10" ,"Error while updaing post status", error));
  }
};

const getCreatedPosts = async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page)
    let posts = await postModel.find({ status: "Draft" }).limit(limit).skip((page - 1) * limit);
    let countedPosts = await postModel.find({ status: "Draft" }).countDocuments();
    posts.noOfDocuments = countedPosts;
    // console.log("posts", posts);
    res
      .status(200)
      .json(customizeResponse(true, "PB_ERROR_CODE_01","All not approved posts", posts));
  } catch (error) {
    console.log("Error while getCreatedPosts", error)
    logger.error("Error while getCreatedPosts", error);
    res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error while getCreatedPosts", error));
  }
};

const getNoOfDocuments = async (req, res) => {
  try {

    let countedPosts = await postModel.find({ status: "Draft" });
    
    // console.log("posts", posts);
    res
      .status(200)
      .json(customizeResponse(true,"PB_ERROR_CODE_01", "All not approved posts", countedPosts));
  } catch (error) {
    console.log("Error while gettting no of documents", error)
    logger.error("Error while gettting no of documents", error);
    res
      .status(200)
      .json(customizeResponse(false, "PB_ERROR_CODE_10","Error while gettting no of documents", error));
  }
};

const adminLogin = async(req, res) => {
  try {
    let {email, password} = req.body;
    let user = await User.find({email});
    if(user.length === 0) {
      return res.status(200).json(customizeResponse(false,"PB_ERROR_CODE_13", "Email or Password incorrect"));
    };

    console.log("admin user==>", user)
   const compare = await bcrypt.compare(password, user[0].password);

   if(!compare) {
   return res.status(400).json(customizeResponse(false,"PB_ERROR_CODE_13", "Email or Password incorrect"));
   }

   if(compare && user[0].role === 'admin') {
    res.status(200).json(customizeResponse(true,"PB_ERROR_CODE_01", "Login Successfull..!"));
   } else {
    res.status(401).json(customizeResponse(false,"PB_ERROR_CODE_05", "Un-Authorized user"));
   }

  } catch (error) {
    console.log("Error while doing admin login", error)
    logger.error("Error while doing admin login", error);
    res
      .status(200)
      .json(customizeResponse(false, "PB_ERROR_CODE_10","Error while doing admin login", error));
    
  }
}

module.exports = { enablePostsToPublic, getCreatedPosts, getNoOfDocuments, adminLogin};
