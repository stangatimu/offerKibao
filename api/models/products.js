const mongoose = require('mongoose'),
mongooseAlgolia = require("mongoose-algolia");

const productSchema = mongoose.Schema({
	name: {type:String, required: true},
	category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
	subcategory: {type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	offerPrice: {type: Number, required: true},
	normalPrice: {type: Number, required: true},
	image: {type: String, required: true},
	description: {type: String, required: true},
	created:{type: Date, default: Date.now}
});
productSchema.plugin(mongooseAlgolia,{
	appId: 'NG3MLLL26O',
	apiKey:'9f227b0ef92a72688924775c7822fb87',
	indexName: 'offerkibaov1',
	selector:'name author category subcategory description offerPrice normalPricr',
	populate: {
		path:'author',
		select:'name desceiption'
	},
	defaults:{
		author: 'unknown'
	},
	mappings:{
		name: function(value){
			return '${value}'
		}
	}
});

let Model = mongoose.model('Product', productSchema); 
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
	searchableAttributes: ['name','description'] 
  });
module.exports = Model