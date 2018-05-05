const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: {type:String, required: true},
	category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
	subcategory: {type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	offerPrice: {type: Number, required: true},
	normalPrice: {type: Number, required: true},
	image: {type: String, required: true},
	description: {type: String, required: true},
	rating:{type:Number, default: 0},
	created:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);