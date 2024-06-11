const admin = require('firebase-admin');
const mongoose = require('mongoose');
const fs = require("fs");
// const path = require('path')
const path = require('path');

// const serviceAccount = require('../config/service.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
const serviceAccount = require('../config/service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const deviceToken = require('../models/deviceTokenModel');



async function sendNotificationsToAdmin(message) {
  try {

    const devices = await deviceToken.find({role: 'admin'});
    const tokens = devices.map(device => device.fcmToken);

    if (tokens.length === 0) {
      console.log('No devices found for followers');
      return null;
    }

    const payload = {
      tokens: tokens,
      notification: {
        title: message.title,
        body: message.body
      }
    };
    console.log("==devices.length", devices.length)
    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log('Successfully sent message:', response);

    return true;
  } catch (error) {
    console.log('Error sending message:', error);
  }
}

module.exports = {sendNotificationsToAdmin}
