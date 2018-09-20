const Product = require("../models/products.js"),
      async = require('async'),
	  mongoose = require("mongoose"),
	  Category = require("../models/category.js"),
	  SubCategory = require("../models/subcategory.js");

//getting all products
exports.products_get_all = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;
	var high = 100000000;
	var low = 0;
	if(req.query.high) high = req.query.high;
	if(req.query.low) low = req.query.low;

	 Product.find({offerPrice: {$lte: high, $gte: low}})
	 .sort({created: -1, rating: -1})
	 .skip(perPage * page)
	 .limit(perPage)
	 .populate('author','name dp')
	 .populate('category','name _id')
	 .populate('subcategory','name _id')
 	.exec()
 	.then(products =>{
 		if (products.length>0) {
 			res.status(200).json({
				 success: true,
				 entries: products});
 		} else {
 			res.status(404).json({
				success: false, 
				message:'No entries found'});
 		}
 	})
 	.catch(err=>{
 		res.status(500).json({
			success: false, 
			message:"sorry! found errors on request"});
 	});
}
//getting trending products
exports.products_get_top = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;
	var high = 100000000;
	var low = 0;
	if(req.query.high) high = req.query.high;
	if(req.query.low) low = req.query.low;

	 Product.find({offerPrice: {$lte: high, $gte: low}})
	 .sort({rating: -1,created: -1})
	 .skip(perPage * page)
	 .limit(perPage)
	 .populate('author','name dp')
	 .populate('category','name _id')
	 .populate('subcategory','name _id')
 	.exec()
 	.then(products =>{
 		if (products.length>0) {
 			res.status(200).json({
				 success: true,
				 entries: products});
 		} else {
 			res.status(404).json({
				success: false, 
				message:'No entries found'});
 		}
 	})
 	.catch(err=>{
 		res.status(500).json({
			success: false, 
			message:"sorry! found errors on request"});
 	});
}
//getting a particular products
exports.products_get_one = function (req, res, next) {
	Product.find({_id: req.params.id})
	.populate('author','name dp')
	.populate('category','name _id')
	.populate('subcategory','name _id')
	.exec()
	.then(product =>{
		if (product) {
			res.status(302).json({
				success: true,
				entry:product
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'No valid entry found for the provided id'});
		}
		
	})
	.catch( err => {
		res.status(500).json({
			success: false,
			message: "sorry! found errors on request"});
	});


}
//getting products in a specific cartegory
exports.products_get_category = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;
	var high = 100000000;
	var low = 0;
	if(req.query.high) high = req.query.high;
	if(req.query.low) low = req.query.low;

	Product.find({category: req.params.id,offerPrice: {$lte: high, $gte: low}})
	.sort({created: -1})
	.skip(perPage * page)
	.limit(perPage)
	.populate('author','name dp')
	.populate('category','name _id')
	.populate('subcategory','name _id')
	.exec()
	.then(products =>{
		if (products) {
			res.status(200).json({
				success: true,
				entries: products});
		} else {
			res.status(404).json({
				success: false,
				message:'No entries yet'});
		}
	})
	.catch(err=>{
		res.status(500).json({
			success: false,
			message:"sorry! found errors on request"});
	});
}
// getting all products in a subcategory
exports.products_get_subcategory = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;
	var high = 100000000;
	var low = 0;
	if(req.query.high) high = req.query.high;
	if(req.query.low) low = req.query.low;

	Product.find({subcategory: req.params.id,offerPrice: {$lte: high, $gte: low}})
	.sort({created: -1})
	.skip(perPage * page )
	.limit(perPage)
	.populate('author','name dp')
	.populate('subcategory','name _id')
	.populate('category','name _id')
	.exec()
	.then(products =>{
		if (products) {
			res.status(200).json({
				success: true,
				entries: products});
		} else {
			res.status(404).json({
				success: false,
				message:'No entries yet'});
		}
	})
	.catch(err=>{
		res.status(500).json({
			success:false,
			message:"sorry! found errors on request"});
	});
}
//getting all products by a specific user
exports.products_get_user_products = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;

	Product.find({author: req.params.id})
	.sort({created: -1})
	.skip(perPage * page)
	.limit(perPage)
	.populate('author','name dp')
	.populate('subcategory','name _id')
	.populate('category','name _id')
	.exec()
	.then(products =>{
		if (products) {
			res.status(200).json({
				success: true,
				count: products.length,
				entries: products});
		} else {
			res.status(404).json({
				success: false,
				message:'No entries yet'});
		}
	})
	.catch(err=>{
		res.status(500).json({
			success: false,
			message:"sorry! found errors on request"});
	});
}
//products by location
exports.products_get_by_location = function(req,res,next){
	const perPage = 10;
	var page = req.query.page;
	Product.find({
		location: {
		 $near: {
		  $maxDistance: req.query.range ,
		  $geometry: {
		   type: "Point",
		   coordinates: [req.query.lon, req.query.lat]
		  }
		 }
		}
	   })
	   .sort({created: -1})
	.skip(perPage * page)
	.limit(perPage)
	.populate('author','name dp')
	.exec()
	.then(products =>{
		if (products) {
			res.status(200).json({
				success: true,
				entries: products});
		} else {
			res.status(404).json({
				success: false,
				message:'No entries yet'});
		}
	})
	.catch(err=>{
		res.status(500).json({
			success: false,
			message:err});
	});
}

//creating a single product
exports.products_create = async function (req, res, next) {
	const geoLoc = {
		type: "Point",
		coordinates: [req.body.lon,req.body.lat]
	}	
	try{
		const category = await Category.findById(req.body.category);
		const subcategory = await SubCategory.findById(req.body.subcategory);
		const product =  new Product({
			name: req.body.name,
			normalPrice: req.body.price1,
			offerPrice: req.body.price2,
			image: req.body.image,
			author: req.userData.userId,
			description: req.body.description,
			category: category._id,
			subcategory: subcategory._id,
			location: geoLoc,
		});
		const newProduct = await Product.create(product);
		category.products++;
		subcategory.products++;
		subcategory.save();
		category.save();
		return res.status(201).json({
			success: true,
			message: 'your product has been posted',
			entry: newProduct
		});
	}catch(err){
		return res.status(400).json({
			success: true,
			message: `Sorry, product could not be posted`
		})
	}
}

//editing a particular product

exports.products_patch = function (req, res, next) {
	const id = req.params.id;
	Product.findOne({_id: id}, (err,product)=>{
		if(err || product.author != req.userData.userId){
			return res.status(403).json({
				success: false,
				message: "product could not be edited."
			})
		}
		if(req.body.name) product.name = req.body.name;
		if(req.body.category) product.category = req.body.category;
		if(req.body.price1) product.offerPrice = req.body.price1;
		if(req.body.price2) product.normalPrice = req.body.price2;
		if(req.body.description) product.description = req.body.description;
		product.save();
		res.status(200).json({
			success: true,
			message: "changes saved successfully",
			product: product
		})	
	});
}
//deleting a product
exports.products_delete = async function (req, res, next) {
	try{
		const product = await Product.findById(req.params.id);
		const category = await Category.findById(product.category);
		const subcategory = await SubCategory.findById(product.SubCategory);
		if(product.author != req.userData.userId){
			return res.status(403).json({
				success: false,
				message:"You are not authorized to delete this product"
			});
		}
		category.products--;
		subcategory.products--;
		subcategory.save();
		category.save();
		Product.remove({ _id: product._id });

		return	res.status(200).json({
				success: true,
				message: "Product has been deleted",
			});
	
		
	}catch(err){
		res.status(500).json({
			success: false,
			message: err
		});
	}	
}