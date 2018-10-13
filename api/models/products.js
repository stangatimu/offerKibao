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
	expireAt :{type: Date,
		 default: function() {
			 let x = new Date();
			 return new Date(x.setMonth(x.getMonth() + 1));
		}
	},
	link:{type:String, default:" "},
	location: {
		type: { type: String },
		coordinates: {type: [Number], default:[0,0]},
	}
},{
	toObject: {virtuals: true},
	toJSON: {virtuals: true}
});

productSchema.virtual('cut')
   .get(function(){
	   var cut = 0;
	   cut = (this.normalPrice-this.offerPrice)/this.normalPrice;
	   cut = cut*100;
	   return Math.fround(cut).toFixed(0);
   });

productSchema.plugin(mongooseAlgolia,{
	appId: process.env.appId,
	apiKey:process.env.apiKey,
	indexName: 'offerkibaov1',
	selector:'name image author cut category subcategory description offerPrice normalPrice',
	populate: {
		path:'author category subcategory',
		select:'name description'
	},
	defaults:{
		author: 'unknown'
	}
});
productSchema.index({location:"2dsphere"});
productSchema.index({ expireAt: 1 }, { expireAfterSeconds : 0 })

let Model = mongoose.model('Product', productSchema); 
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
	searchableAttributes: ['name','description','category','subcategory'] 
  });
module.exports = Model