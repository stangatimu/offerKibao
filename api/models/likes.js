const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    prodId:{type: String, required: true},
    userId:{type: String, required: true},
});

module.exports = mongoose.model('Like', likeSchema);