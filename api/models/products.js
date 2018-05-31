const mongoose = require('mongoose'),
mongooseAlgolia = require("mongoose-algolia");

const productSchema = mongoose.Schema({
	name: {type:String, required: true},
	category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
	subcategory: {type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	rating:{type: Number, default:0},
	offerPrice: {type: Number, required: true},
	normalPrice: {type: Number, required: true},
	image: {type: String, required: true},
	description: {type: String, required: true},
	created:{type: Date, default: Date.now},
	location: {
		type: { type: String },
		coordinates: {type: [Number], default:[0,0]},
	}
});

// productSchema.plugin(mongooseAlgolia,{
// 	appId: 'NG3MLLL26O',
// 	apiKey:'9f227b0ef92a72688924775c7822fb87',
// 	indexName: 'offerkibaov1',
// 	selector:'name author category subcategory description offerPrice normalPrice',
// 	populate: {
// 		path:'author category subcategory',
// 		select:'name description'
// 	},
// 	defaults:{
// 		author: 'unknown'
// 	}
// });
// productSchema.index({location:"2dsphere"});

let Model = mongoose.model('Product', productSchema); 
// Model.SyncToAlgolia();
// Model.SetAlgoliaSettings({
// 	searchableAttributes: ['name','description','category','subcategory'] 
//   });
module.exports = Model