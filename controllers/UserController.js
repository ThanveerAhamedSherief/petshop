const { secretkey, limit, geo_code_key } = require("../config/config");
const { gfs } = require("../db/connection");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary, deleteOnCloudinary } = require("../utils/cloudinary");
const { postModel } = require("../models/postModel");
const { getAddressFromLatLng, getCoordinatesFromPincode } = require("../utils/geoCode");
const deviceToken = require("../models/deviceTokenModel");

exports.registerUser = async (req, res) => {
  try {
    let {
      email,
      password,
      name,
      gender,
      phoneNumber,
      isActive,
      pincode,
      dob,
      userType,
      fcmToken
    } = req.body;
    let latitude,longtitude, city, country, state, displayAddress;
    console.log("files==>", req.file);
    let avatar;
    if (req.file) {
      const avatarLocalPath = req.file.path;
      avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    //  avatar = await uploadOnCloudinary(avatarLocalPath);
    let address;
    let getLatAndLang = await getCoordinatesFromPincode(pincode, geo_code_key);
    if (getLatAndLang) {
      latitude = getLatAndLang.lat;
      longtitude = getLatAndLang.lon;
      address = await getAddressFromLatLng(latitude, longtitude, geo_code_key);
      if(address) {
        city = address.address['state_district'];
        state = address.address['state'];
        country = address.address['country'];
        displayAddress = address.display_name;
      }
    }

    console.log("address==>", address?.display_name);

    if (!(email && password && name)) {
      return res
        .status(401)
        .json(customizeResponse(false, "All fields are mandatory..!",[]));
    }
    if (!fcmToken) {
      return res
        .status(401)
        .json(customizeResponse(false, "Token is missing",[]));
    }
    let isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res
        .status(401)
        .json(customizeResponse(false, "User already exists", []));
    }
   if(getLatAndLang) {
    const createUser = await User.create({
      name,
      email,
      password,
      gender,
      phoneNumber,
      isActive,
      city,
      state,
      country,
      pincode,
      latitude,
      longtitude,
      profilePic: avatar?.url ? avatar.url : "",
      dob,
      userType,
      displayAddress
    });
    let token = await createUser.generateToken();
    await deviceToken.create({
      fcmToken: fcmToken,
      userId: createUser._id
    });
    res
    .status(201)
    .json(customizeResponse(true, "New user created successfully", {...createUser._doc, token}));
   } else {
   return res
      .status(400)
      .json(customizeResponse(false, "There's issue in your pincode please provide valid code"));
   }

  } catch (error) {
    let errorUser = await User.findOne({email});
    if(errorUser) {
      await User.deleteOne({_id: errorUser._id})
    }
    console.log("Error from register", error);
    logger.error("Error while registering a user", error);
    res
      .status(400)
      .json(customizeResponse(false, "Error while registering an user", error));
  }
};

exports.findUser = async (req, res) => {
  try {
    let { email } = req.params;
    let {fcmToken} = req.query;
    console.log("Params", req.params);
    let userExist = await User.findOne({ email });

    if (!userExist) {
      return res
        .status(200)
        .json(customizeResponse(false, "User doesn't exists", null));
    }

    let data = userExist
      ? {
          ...userExist._doc,
          token: await userExist.generateToken(),
        }
      : null;
    console.log("data", data._id,);
    if(fcmToken) {
      let updateToken = await deviceToken.findOneAndUpdate({userId: userExist._id},{ $set: { fcmToken: fcmToken }},{
        new: true
      });
      console.log("fcmToken", updateToken)
    }

    res
      .status(200)
      .json(customizeResponse(true, "User Fetch Api Successfull", data));
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      msg: "Error in Login",
      error,
    });
  }
};

exports.fetchUserPosts = async (req, res) => {
  try {
    let { userId } = req.params;
    let {page, status} = req.query;
    let isStatusAvailable = (status !== undefined && status !== "") ? true : false;
    console.log("userId", userId);
    let fetchedUserDetails = await postModel
      .find({ ownerId: userId, ...(isStatusAvailable && {status}) })
      .limit(limit)
      .skip(parseInt(page - 1) * limit);

    res
      .status(200)
      .json(
        customizeResponse(
          true,
          "Fetched user details successfully",
          fetchedUserDetails
        )
      );
  } catch (error) {
    console.log("Error from fetchUserProfile", error);
    logger.error("Error while fetchUserProfile", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while fetchUserProfile", error));
  }
};

exports.fetchAllUser = async (req, res) => {
  try {
    let {page} = req.query;
    let fetchedUserDetails = await User
      .find()
      .limit(limit)
      .skip(parseInt(page - 1) * limit);

    res
      .status(200)
      .json(
        customizeResponse(
          true,
          "Fetched All user",
          fetchedUserDetails
        )
      );
  } catch (error) {
    console.log("Error from all user fetch", error);
    logger.error("Error from all user fetch", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error from all user fetch", error));
  }
};

exports.updateUser = async (req, res) => {
  try {
    let { userId } = req.params;
    console.log("userId id from params", userId)
    console.log("files==>", req.file);
    let avatar;
    if (req.file) {
      const avatarLocalPath = req.file.path;
      avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    if(req.file && avatar?.url) {
      req.body.profilePic = avatar?.url;
    }
    let updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true} );
    res.status(200).json(customizeResponse(true, "User updated successfully", updatedUser));
  } catch (error) {
    logger.error("Error while updating the user:", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while updating the user", error));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let { userId } = req.params;
    console.log("userId id from params", userId)
    let user = await User.findById(userId);

    if(user) {
      await deleteOnCloudinary(user.profilePic);
    }
    else {
      return res
        .status(200)
        .json(customizeResponse(false, "User doesn't exists", null));
    }
    let userPostedPost = await postModel.find({ownerId: user._id});
      let images = [];
     if(userPostedPost.length > 0) {
      let deletedPost = await Promise.all(userPostedPost.map( async (each) => {
        images.push(...each.petImages);
       return await postModel.deleteOne({_id: each})

      }));
      console.log("Length of images array", images.length)
      await User.deleteOne({_id: userId});
      let deletedOn = await Promise.all(images.map(async (img) => await deleteOnCloudinary(img)))
     }
    res.status(200).json(customizeResponse(true, "User Deleted successfully"));
  } catch (error) {
    logger.error("Error while deleting an user", error);
    console.log("Error while deleting an user", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while deleting an user", error));
  }
};



