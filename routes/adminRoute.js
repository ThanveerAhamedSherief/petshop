const express = require("express");
const {authenticateAdminToken} = require("../services/authMiddleware");
const { getCreatedPosts, enablePostsToPublic, getNoOfDocuments, adminLogin } = require("../controllers/AdminController");
const { updatePosts } = require("../controllers/PostController");
const { fetchAllUser } = require("../controllers/UserController");
const adminRouter = express.Router();


adminRouter.route('/approvePosts')
adminRouter.route('/requestedPosts').get(getCreatedPosts);
adminRouter.route('/:postId/updatePostStatus').put(enablePostsToPublic);
adminRouter.route('/noOfDocuments').get(getNoOfDocuments);
adminRouter.route('/:postId/updatePost').put(updatePosts);
adminRouter.route('/allUser').get(fetchAllUser);
adminRouter.route('/login').post(adminLogin);

// adminRouter.route('/approvePosts')
// adminRouter.route('/requestedPosts').get(authenticateAdminToken, getCreatedPosts);
// adminRouter.route('/:postId/updatePostStatus').put(authenticateAdminToken, enablePostsToPublic);





module.exports = adminRouter;