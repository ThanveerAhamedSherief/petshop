const { secretkey } = require("../config/config");
const { gfs } = require("../db/connection");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { uploadOnCloudinary } = require("../utils/cloudinary");



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
    } = req.body;
    console.log("files==>", req.file)
    let fileInfo;
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

   
    if (!(email && password && name)) {
      return res
        .status(401)
        .json(customizeResponse(false, "All fields are mandatory..!"));
    }
    let isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res
        .status(401)
        .json(customizeResponse(false, "User already exists"));
    }
    
    console.log("fileInfo", avatar.url);
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
      profilePic: avatar.url
    });
    let token = await createUser.generateToken();
    console.log("Token==>", token);
    let response = {
      email: createUser.email,
      name: createUser.name,
      id: createUser.id,
      token
    };
    res
      .status(201)
      .json(customizeResponse(true, "New user created successfully", response));
  } catch (error) {
    logger.error("Error while registering a user", error);
    res
      .status(400)
      .json(customizeResponse(false, "Error while registering an user", error));
  }
};

exports.findUser = async (req, res) => {
    try {
        let { email } = req.params;
        console.log("Params",req.params)
        let userExist = await User.findOne({ email });

        if(!userExist) {
            return res.status(400).json({msg: "Invalid credentials"})
        };
        let data = userExist ? {
            ...userExist._doc,
            token: await userExist.generateToken()
        } : null;
        console.log("data", data)
        res.status(200).json(customizeResponse(
            true,
            "User Fetch Api Successfull",
            data
        ))
        
    } catch (error) {
      console.log("Error", error)
        res.status(500).json({
            msg: "Error in Login",
            error
        });
    }
}




