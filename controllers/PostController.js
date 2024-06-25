const { secretkey, limit } = require("../config/config");
const { gfs } = require("../db/connection");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary, deleteOnCloudinary } = require("../utils/cloudinary");
const { postModel } = require("../models/postModel");
const { sendNotificationsToAdmin } = require("../services/pushNotification");

exports.createPost = async (req, res) => {
  try {
    let {
      petName,
      breedName,
      Adoption,
      address,
      petGender,
      petDob,
      petColor,
      petType,
      Description,
      weight,
      price,
      whatsAppNumber,
      city,
    } = req.body;
    const { ownerId, username } = req.params;
    console.log("files==>", req.files);
    const avatarLocalPath = req.files?.images;
    let images = [];
    if (avatarLocalPath) {
      images = await uploadOnCloudinary(avatarLocalPath);
    }
    let user = await User.findById(ownerId);
    let location = user
      ? {
          type: "Point",
          coordinates: [user.longtitude, user.latitude],
        }
      : {};
    // location = JSON.parse(location)
    const createUser = await postModel.create({
      ownerId,
      petName,
      breedName,
      Adoption,
      address,
      petGender,
      petDob,
      petColor,
      petType,
      Description,
      weight,
      price,
      whatsAppNumber,
      petImages: images,
      location,
      createdOn: Date.now(),
      city,
    });
    await User.updateOne(
      { _id: ownerId },
      {
        $push: { posts: createUser._id },
      }
    );
    let message = {
      title: `${username} posted a post`,
      body: `${Description}`
    }
    await sendNotificationsToAdmin(message);
    res.status(201).json(customizeResponse(true,"PB_ERROR_CODE_01", "Post created", createUser));
  } catch (error) {
    logger.error("Error while creating post ", error);
    res
      .status(500)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error while creating post", error));
  }
};

exports.findNearBy = async (req, res) => {
  try {
    let { lat, lang, page, petType } = req.query;

    console.log("petType", petType);

    let isTypeAvailable =
      petType !== undefined && petType !== "" ? true : false;

    console.log("isTypeAvailable", isTypeAvailable);

    async function findNearbyLocations(latitude, longitude) {
      let locations = await postModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            key: "location",
            maxDistance: 500000, // 500 kilometers in meters
            distanceField: "dist.calculated",
            spherical: true,
          },
        },
        {
          $match: {
            status: "Approved", 
            ...(isTypeAvailable && { petType }),
          },
        },
        {
          $addFields: {
            "dist.calculated": {
              $toInt: { $divide: ["$dist.calculated", 1000] }, // Convert meters to kilometers
            },
          },
        },
        {
          $skip: (parseInt(page) - 1) * parseInt(limit),
        },
        {
          $limit: parseInt(limit),
        },
        {
          $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "_id",
            as: "postedUser",
          },
        },
      ]);

      return locations;
    }

    console.log(parseFloat(lang), parseFloat(lat));
    findNearbyLocations(parseFloat(lat), parseFloat(lang))
      .then((nearbyLocations) => {
        res
          .status(200)
          .json(customizeResponse(true,"PB_ERROR_CODE_01", "Post created", nearbyLocations));
      })
      .catch((error) => {
        console.error("Error finding nearby locations:", error);
      });
  } catch (error) {
    logger.error("Error finding nearby locations:", error);
    res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error finding nearby locations:", error));
  }
};

exports.updatePosts = async (req, res) => {
  try {
    let { postId } = req.params;
    const avatarLocalPath = req.files?.images;
    let images = [];
    if (avatarLocalPath) {
      images = await uploadOnCloudinary(avatarLocalPath);
    }
    if(req.files && images.length > 0) {
      req.body.petImages = images;
    }
    console.log("Post id from params", req.body)
    let updatedPosts = await postModel.findByIdAndUpdate(postId, req.body, { new: true} );
    res.status(200).json(customizeResponse(true,"PB_ERROR_CODE_01", "Post updated successfully", updatedPosts));
  } catch (error) {
    logger.error("Error while updating the posts:", error);
    res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error while updating the posts", error));
  }
};

exports.deleteImages = async (req, res) => {
  try {
    let { postId} = req.params;
    let {imageUrl} = req.body;
    await deleteOnCloudinary(imageUrl);

    let post = await postModel.findById(postId);
    let filteredPost;
    if(post) {
     filteredPost = post.petImages.filter((img) => img != imageUrl);
      post.petImages = filteredPost
    }
    console.log("finddd=>",post)

    await post.save();
   
    res.status(200).json(customizeResponse(true,"PB_ERROR_CODE_01", "Image Deleted successfully", post));
  } catch (error) {
    logger.error("Error while deleting the images:", error);
    res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error while deleting the images:", error));
  }
};

exports.deletePost = async (req, res) => {
  try {
    let {postId} = req.params;
    let post = await postModel.findById(postId);
    if(post) {
    let deleteImage = await post.petImages.map(async (img) => {
      return await deleteOnCloudinary(img)
    });
    await Promise.all(deleteImage);
    let deletedPost = await postModel.findByIdAndDelete(postId);

    res.status(200).json(customizeResponse(true,"PB_ERROR_CODE_01", "Post deleteted successfully", deletedPost))
    }
    console.log("#################")
  } catch (error) {
    logger.error("Error while deleting a post", error);
    res
      .status(500)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error while deleting a post:", error));
  }
};
exports.updatePostStatus = async (req, res) => {
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
    .status(500)
    .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error while updaing post status", error));
  }
};

exports.getListOfSoldPosts = async (req, res) => {
  try {
    let {page} = req.query;
    let soldedPosts = await postModel
      .find({
        status: 'Sold'
      })
      .limit(limit)
      .skip(parseInt(page - 1) * limit);

    res
      .status(200)
      .json(
        customizeResponse(
          true,
          "PB_ERROR_CODE_01",
          "Fetched All Solded products",
          soldedPosts
        )
      );
  } catch (error) {
    console.log("Error from all sold fetch", error);
    logger.error("Error from all sold fetch", error);
    res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_10", "Error from all sold fetch", error));
  }
}
