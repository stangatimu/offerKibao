const mongoose = require('mongoose')

const cartegorySchema = mongoose.Schema({
    name: {type: String, required: true},
    icon: {type: String, required: true},
    created:{type: Date, default: Date.now},
    subcategories:[ 
        {type: mongoose.Schema.Types.ObjectId, ref: "SubCategory"}
    ],
    products:{type:Number, default: 0}
});

module.exports = mongoose.model('Category',cartegorySchema)