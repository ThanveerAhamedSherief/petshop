const mongoose = require('mongoose');


const storeSchema = new mongoose.Schema({
  isForceUpdateEnable: Boolean,
  isPrivacyUrl: String,
  termsAndConditionUrl: String
});
const store = mongoose.model('store', storeSchema);
module.exports = store;
