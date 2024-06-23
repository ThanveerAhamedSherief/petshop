const express = require("express");
const { createStoreData, isUpdateAvailable, createContactAnalyticsRecord, getContatactAnalytics } = require("../controllers/commonController");
const router = express.Router();

router.route('/createStore').post(createStoreData);
router.route('/isUpdateAvailable').get(isUpdateAvailable);
router.route('/createContactRecord').post(createContactAnalyticsRecord);
router.route('/getRecord/:ownerId').get(getContatactAnalytics);

module.exports = router;