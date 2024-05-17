const express = require("express");
const { registerUser, findUser } = require("../controllers/UserController");
const { upload } = require("../services/imageUploader");
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

module.exports = userRouter;
