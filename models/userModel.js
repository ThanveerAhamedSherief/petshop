const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { secretkey } = require("../config/config");


const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email:{
        required: true,
        unique:true,
        type: String
    },
    password: {
      required: true,
      type: String,
    },
    gender: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    isActive: {
      type: Boolean,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    longtitude: {
      type: Number,
    },
    role: {
        type: String,
        default: 'user'
    },
    profilePic: {
        type: String
    },
    dob:{
      type: Number
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: "post"
    },
    userType:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) {
    next();
  }

  try {
    let salt = await bcrypt.genSalt(10);
    let hashed_password = await bcrypt.hash(user.password, salt);
    user.password = hashed_password;
  } catch (error) {
    next(error);
  }
});
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            role: this.role
        },secretkey,{
            expiresIn:'360d'
        })
    } catch (error) {
        console.error(error);
    }
}

module.exports.User = mongoose.model("User", userSchema);
