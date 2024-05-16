const { secretkey } = require("../config/config");
const { gfs } = require("../db/connection");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { postModel } = require("../models/postModel");



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
        whatsAppNumber
      } = req.body;
      const { ownerId } = req.params;
      console.log("files==>", req.files)
      const avatarLocalPath = req.files?.images;
      let images = [];
      if (avatarLocalPath) {
        images = await uploadOnCloudinary(avatarLocalPath);
      }
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
        petImages: images
      });
   
      res
        .status(201)
        .json(customizeResponse(true, "Post created", createUser));
    } catch (error) {
      logger.error("Error while registering a user", error);
      res
        .status(400)
        .json(customizeResponse(false, "Error while registering an user", error));
    }
  };

  

