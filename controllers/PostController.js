const { secretkey } = require("../config/config");
const { gfs } = require("../db/connection");
const { User } = require("../models/userModel");
const { customizeResponse } = require("../utils/customResponse");
const logger = require("../utils/logGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
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
      whatsAppNumber,
      location,
      city,
    } = req.body;
    const { ownerId } = req.params;
    console.log("files==>", req.files);
    const avatarLocalPath = req.files?.images;
    let images = [];
    if (avatarLocalPath) {
      images = await uploadOnCloudinary(avatarLocalPath);
    }
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
      city,
    });
    res.status(201).json(customizeResponse(true, "Post created", createUser));
  } catch (error) {
    logger.error("Error while registering a user", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error while registering an user", error));
  }
};

exports.findNearBy = async (req, res) => {
  try {
    let { lat, lang } = req.query;

    async function findNearbyLocations(latitude, longtitude) {
      let locations = await postModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longtitude, latitude] },
            key: "location",
            maxDistance: 500000, //parseFloat(500) * 1609,
            distanceField: "dist.calculated",
            spherical: true,
          },
        },
        {
          $addFields: {
            "dist.calculated": { $divide: ["$dist.calculated", 1000] }, // Convert meters to kilometers
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
          .json(customizeResponse(true, "Post created", nearbyLocations));
      })
      .catch((error) => {
        console.error("Error finding nearby locations:", error);
      });
  } catch (error) {
    logger.error("Error finding nearby locations:", error);
    res
      .status(500)
      .json(customizeResponse(false, "Error finding nearby locations:", error));
  }
};
