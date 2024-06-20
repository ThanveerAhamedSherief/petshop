const express = require("express");
const { createStoreData, isUpdateAvailable } = require("../controllers/commonController");
const router = express.Router();

router.route('/createStore').post(createStoreData);
router.route('/isUpdateAvailable').get(isUpdateAvailable);

module.exports = router;