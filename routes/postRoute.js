const express = require('express');
const { registerUser, findUser } = require('../controllers/UserController');
const { upload } = require('../services/imageUploader');
const { model } = require('mongoose');
const { createPost, findNearBy, deleteImages, deletePost, updatePosts, getListOfSoldPosts } = require('../controllers/PostController');
const { authenticateUserToken } = require('../services/authMiddleware');
const postRouter = express.Router();




postRouter.route('/:ownerId/:username/createPost').post(

    upload.fields([
        { name: 'images', maxCount: 5}
    ]),
    createPost
    );
    
postRouter.route('/getNearByPosts').get(authenticateUserToken, findNearBy);
postRouter.route('/:postId/updatePost').put(authenticateUserToken, upload.fields([
    { name: 'images', maxCount: 5}
]),updatePosts);
postRouter.route('/:postId').delete(authenticateUserToken, deleteImages);
postRouter.route('/deletePost/:postId').delete(authenticateUserToken, deletePost);
postRouter.route('/soldPosts').get(authenticateUserToken, getListOfSoldPosts);
// postRouter.route('/:ownerId/createPost').post(
//     authenticateUserToken,
//     upload.fields([
//         { name: 'images', maxCount: 5}
//     ]),
//     createPost
//     );
    
// postRouter.route('/getNearByPosts').get(authenticateUserToken,findNearBy)



module.exports = postRouter;