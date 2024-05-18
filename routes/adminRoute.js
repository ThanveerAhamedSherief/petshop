const express = require("express");
const authenticateAdminToken = require("../services/authMiddleware");
const { getCreatedPosts, enablePostsToPublic } = require("../controllers/AdminController");
const adminRouter = express.Router();


adminRouter.route('/approvePosts')
adminRouter.route('/requestedPosts').get(getCreatedPosts);
adminRouter.route('/:postId/updatePostStatus').put(enablePostsToPublic);





module.exports = adminRouter;