const mongoose = require('mongoose');

var storeSchema = new mongoose.Schema({
    "_id": String,
    "data": {
      "count": Number,
      "lastRequest": Date,
      "firstRequest": Date
    },
    "expires": 86400
  });

module.exports = mongoose.model('Store',storeSchema);