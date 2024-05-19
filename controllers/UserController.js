const { secretkey, limit } = require("../config/config");
const { gfs } = require("../db/connection");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { postModel } = require("../models/postModel");

exports.registerUser = async (req, res) => {
  try {
    let {
      email,
      password,
      name,
      gender,
      phoneNumber,
      isActive,
      city,
      state,
      country,
      pincode,
      latitude,
      longtitude,
      dob,
      userType,
    } = req.body;
    console.log("files==>", req.file);
    let avatar;
    if (req.file) {
      const avatarLocalPath = req.file.path;
      avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    //  avatar = await uploadOnCloudinary(avatarLocalPath);

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
    });
    let token = await createUser.generateToken();
    console.log("Token==>", token);
    let response = {
      email: createUser.email,
      name: createUser.name,
      id: createUser.id,
      token,
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
