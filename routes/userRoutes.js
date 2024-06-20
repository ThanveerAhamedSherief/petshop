const express = require("express");
const { registerUser, findUser, fetchUserPosts, updateUser, deleteUser } = require("../controllers/UserController");
const { upload } = require("../services/imageUploader");
const { authenticateUserToken } = require("../services/authMiddleware");
const { updatePosts, updatePostStatus } = require("../controllers/PostController");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.status(200).json({
    Message: "Routes are wokring fine",
  });
});

// userRouter.route('/register').post(
//     upload.fields([
//         { name: 'avatar', maxCount: 1 }
//     ]),
//     registerUser
//     );
userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.get("/details/:email", findUser);
userRouter.route('/:userId/getUserProfile').get(fetchUserPosts);
userRouter.route('/:userId/updateProfile').put(upload.single("avatar"), updateUser);
userRouter.route('/:postId/updatePostStatus').put(updatePostStatus);
userRouter.route('/deleteUser/:userId').delete(deleteUser)

// userRouter.route("/register").post(upload.single("avatar"), registerUser);
// userRouter.get("/details/:email", findUser);
// userRouter.route('/:userId/getUserProfile').get(authenticateUserToken, fetchUserPosts);

module.exports = userRouter;
