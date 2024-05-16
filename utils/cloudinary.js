// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
const  cloudinary = require('cloudinary');
const fs = require('fs');
const {cloud_name,api_key, api_secret} = require('../config/config')

cloudinary.config({ 
  cloud_name, 
  api_key, 
  api_secret
});
          
// cloudinary.v2.config({ 
//   cloud_name: 'dsyq7a8ib', 
//   api_key: '982275731934117', 
//   api_secret: 'v5Lz549l98ZgVbdOkAJq9NzjYkY' 
// });
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log('lmmnnnkn', localFilePath);
        let response;
        if(Array.isArray(localFilePath))  {
            let urls = await Promise.all(localFilePath.map(async (image) => {
                console.log("path", image.path)
               let res = await cloudinary.v2.uploader.upload(image.path, {
                    resource_type: "auto"
                });
                // console.log("resssooo", res)
                // urls.push(res.url);
                fs.unlinkSync(image.path);
                return res.url;

            }))
             response = urls;
            // // fs.unlinkSync(localFilePath)
            // console.log("finidnnid")
            // return response;
        } else {
            response = await cloudinary.v2.uploader.upload(localFilePath, {
                        resource_type: "auto"
                    });
                    fs.unlinkSync(localFilePath)
                    return response;
        }
        return response;
    //    let response = await cloudinary.v2.uploader.upload(localFilePath, {
    //         resource_type: "auto"
    //     })
        // console.log("bjbjgjgjgjj", response)
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        // fs.unlinkSync(localFilePath)
        // return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



module.exports= {uploadOnCloudinary}