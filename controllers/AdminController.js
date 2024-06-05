const { limit } = require("../config/config");
const { postModel } = require("../models/postModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");

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
      .json(customizeResponse(true, "Post updated successfully", updatePost));


  } catch (error) {
    console.log("Error while updaing post status", error)
    res
    .status(500)
    .json(customizeResponse(false, "Error while updaing post status", error));
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
      .json(customizeResponse(true, "All not approved posts", posts));
  } catch (error) {
    console.log("Error while getCreatedPosts", error)
    logger.error("Error while getCreatedPosts", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while getCreatedPosts", error));
  }
};

const getNoOfDocuments = async (req, res) => {
  try {

    let countedPosts = await postModel.find({ status: "Draft" });
    
    // console.log("posts", posts);
    res
      .status(200)
      .json(customizeResponse(true, "All not approved posts", countedPosts));
  } catch (error) {
    console.log("Error while gettting no of documents", error)
    logger.error("Error while gettting no of documents", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while gettting no of documents", error));
  }
};

module.exports = { enablePostsToPublic, getCreatedPosts, getNoOfDocuments };
