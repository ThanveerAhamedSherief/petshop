const express = require('express');
const { registerUser, findUser } = require('../controllers/UserController');
const { upload } = require('../services/imageUploader');
const { model } = require('mongoose');
const { createPost, findNearBy } = require('../controllers/PostController');
const postRouter = express.Router();




postRouter.route('/:ownerId/createPost').post(
    upload.fields([
        { name: 'images', maxCount: 5}
    ]),
    createPost
    );
    
postRouter.route('/getNearByPosts').get(findNearBy)



module.exports = postRouter;