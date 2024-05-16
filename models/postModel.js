const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    petName:{
        type: String
    },
    breedName:{
        type: String
    },
    Adoption: {
        type: String
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    country:{
        type: String
    },
    petGender:{
        type: String
    },
    petDob: {
        type: Date
    },
    petColor: {
        type: String
    },
    petType: {
        type: String
    },
    Description:{
        type: String
    },
    weight:{
        type: Number
    },
    price: {
        type: Number,
        default:0
    },
    whatsAppNumber: {
        type: Number
    },
    petImages:{
        type: Array,
        default: []
    },
    isPublicEnabled: {
        type: Boolean,
        default: false
    },
    latitude: Number,
    longtitude: Number,
    pincode: Number
},{
    timestamps: true
});

exports.postModel = mongoose.model('post', postSchema);