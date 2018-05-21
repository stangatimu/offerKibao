const mongoose = require('mongoose')

const subCartegorySchema = mongoose.Schema({
    name: {type: String, required: true},
    created:{type: Date, default: Date.now},
    products: {type:Number, default: 0}
});

module.exports = mongoose.model('SubCategory',subCartegorySchema)