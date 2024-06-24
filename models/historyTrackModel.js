const mongoose = require('mongoose');


const trackSchema = new mongoose.Schema({
  requesterId: String,
  requestedPostId: String,
  requesterWhatappNumber: Number,
  requestedPetname: String,
  requestedMode: String,
  requestedDateAndTime: Number,
  postOwnerId: String
});
const contactAnalytics = mongoose.model('contactAnalytics', trackSchema);
module.exports = contactAnalytics;
