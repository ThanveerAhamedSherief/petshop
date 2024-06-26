const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./tmp/uploads")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
exports.upload = multer({ storage: storage });

