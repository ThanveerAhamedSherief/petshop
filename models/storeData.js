const mongoose = require('mongoose');


const storeSchema = new mongoose.Schema({
  isForceUpdateEnable: Boolean
});
const store = mongoose.model('store', storeSchema);
module.exports = store;
