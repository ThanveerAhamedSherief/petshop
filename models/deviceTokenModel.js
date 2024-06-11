const mongoose = require('mongoose');


const DeviceTokenSchema = new mongoose.Schema({
  fcmToken: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  role: {
    type: String,
    default: 'user'
  }
});
const deviceToken = mongoose.model('devicetoken', DeviceTokenSchema);
module.exports = deviceToken;
