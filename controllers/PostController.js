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
    const { ownerId } = req.params;
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
