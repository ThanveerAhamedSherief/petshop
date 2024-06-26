const mongoose = require("mongoose");
const { Schema } = mongoose;
const mogooseAggresgate = require("mongoose-aggregate-paginate-v2");
const postSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    petName: {
      type: String,
    },
    breedName: {
      type: String,
    },
    Adoption: {
      type: String,
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
    petGender: {
      type: String,
    },
    petDob: {
      type: Number,
    },
    petColor: {
      type: String,
    },
    petType: {
      type: String,
    },
    Description: {
      type: String,
    },
    weight: {
      type: String,
    },
    price: {
      type: String,
    },
    whatsAppNumber: {
      type: Number,
    },
    petImages: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "Draft",
    },
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    pincode: Number,
    createdOn: Date,
    updatedOn: Date
  },
  {
    timestamps: true,
  }
);
postSchema.plugin(mogooseAggresgate);
postSchema.index({ location: "2dsphere" });

exports.postModel = mongoose.model("post", postSchema);
