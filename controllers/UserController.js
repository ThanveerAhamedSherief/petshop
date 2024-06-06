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
        .json(customizeResponse(false, "All fields are mandatory..!"));
    }
    let isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res
        .status(401)
        .json(customizeResponse(false, "User already exists", []));
    }

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
    let response = {
      email: createUser.email,
      name: createUser.name,
      _id: createUser.id,
      token,
      address: address ? address.address : {},
      displayAddress
    };
    res
      .status(201)
      .json(customizeResponse(true, "New user created successfully", response));
  } catch (error) {
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
    console.log("data", data);
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
    let userPostedPost = await postModel.find({ownerId: user._id});
     console.log("userPosted posts====>", userPostedPost);

     userPostedPost.forEach(async (eachPost) => {
      
     });
    // let avatar;
    // if (req.file) {
    //   const avatarLocalPath = req.file.path;
    //   avatar = await uploadOnCloudinary(avatarLocalPath);
    // }
    if(req.file && avatar?.url) {
      req.body.profilePic = avatar?.url;
    }
    let updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true} );
    res.status(200).json(customizeResponse(true, "User updated successfully", updatedUser));
  } catch (error) {
    logger.error("Error while deleting an user", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while deleting an user", error));
  }
};



