// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
const cloudinary = require("cloudinary");
const fs = require("fs");
const { cloud_name, api_key, api_secret } = require("../config/config");

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    let response;
    if (Array.isArray(localFilePath)) {
      let urls = await Promise.all(
        localFilePath.map(async (image) => {
          console.log("path", image.path);
          let res = await cloudinary.v2.uploader.upload(image.path, {
            resource_type: "auto",
          });
          fs.unlinkSync(image.path);
          return res.url;
        })
      );
      response = urls;
    } else {
      response = await cloudinary.v2.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localFilePath);
      return response;
    }
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);

    let result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return null;
  }
};

function extractPublicId(url) {
  const urlParts = url.split("/");
  const publicIdWithExtension = urlParts.pop();
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
}

module.exports = { uploadOnCloudinary, deleteOnCloudinary };
