const Product = require("../models/products.js"),
	  mongoose = require("mongoose"),
	  Category = require("../models/category.js"),
	  SubCategory = require("../models/subcategory.js");

//getting all products
exports.products_get_all = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;

	 Product.find()
	 .skip(perPage * page)
	 .limit(perPage)
	 .populate('author','name')
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
	Product.findById(req.params.id)
	.populate('author','name')
	.populate('category','name _id')
	.populate('subcategory','name _id')
	.exec()
	.then(product =>{
		if (product) {
			res.status(302).json(product);
		} else {
			res.status(404).json({message: 'No valid entry found for the provided id'});
		}
		
	})
	.catch( err => {
		res.status(500).json({error: "sorry! found errors on request"});
	});


}
//getting products in a specific cartegory
exports.products_get_category = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;

	Product.find({category: req.params.id})
	.skip(perPage * page)
	.limit(perPage)
	.populate('author','name')
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
		res.status(500).json({error:"sorry! found errors on request"});
	});
}
// getting all products in a subcategory
exports.products_get_subcategory = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;

	Product.find({subcategory: req.params.subId})
	.skip(perPage * page )
	.limit(perPage)
	.populate('author','name')
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
			error:"sorry! found errors on request"});
	});
}
//getting all products by a specific user
exports.products_get_user_products = function (req, res, next) {
	const perPage = 10;
	var page = req.query.page;

	Product.find({author: req.params.id})
	.skip(perPage * page)
	.limit(perPage)
	.populate('author','name')
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
		res.status(500).json({error:"sorry! found errors on request"});
	});
}

//creating a single product
exports.products_create = function (req, res, next) {
	
	const product = new Product({
		name: req.body.name,
		normalPrice: req.body.price1,
		offerPrice: req.body.price2,
		image: req.file.path,
		author: req.userData.userId,
		description: req.body.description,
		category: req.body.category,
		subcategory: req.body.subcategory
	});

	async.parallel([
		function(callback){
			Product.create(product,(err, newProduct)=>{
				callback(err, newProduct);
			});
		},
		function(callback){
			Category.findById(req.body.category,(err,category)=>{
				callback(err, category);
			});
		},
		function(callback){
			SubCategory.findById(req.body.subcategory,(err,subcategory)=>{
				
				callback(err, subcategory);
			});
		},
	], function(err,results){
		if (err) {
			res.status(500).json({
				success: false,
				message: "Product could not be created"
			});
		} else {
			newProduct = results[0];
			category = results[1];
			subcategory = results[2];
			if (category != null && subcategory != null) {
				category.products++;
				subcategory.products++;
				subcategory.save();
				category.save();
				return next();
			}			
			res.status(201).json({
				success: true,
				message: 'your product has been posted',
				entry: {
					name: newProduct.name,
					price1: newProduct.normalPrice,
					price2: newProduct.offerPrice,
					image: newProduct.image,
					_id: newProduct._id,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + newProduct.id
					}
				}
			});
		}

	});
	
		
	
}

//editing a particular product

exports.products_patch = function (req, res, next) {
	const id = req.params.id;
	Product.findOne({_id: id}, (err,product)=>{
		if(err)return next(err);
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
exports.products_delete = function (req, res, next) {
	
	async.waterfall([
		function(callback){
			Product.findById(req.params.id,(err,product)=>{
				callback(err,product);
			});
		},
		function(product,callback){
			Category.findById(product.category,(err,category)=>{
				callback(err,product,category);
			});
		},
		function(product,category,callback){
			SubCategory.findById(product.subcategory,(err,subcategory)=>{
				callback(err,product,category,subcategory);
			});
		},
		function (product, category, subcategory, callback) {
			category.products--;
			subcategory.products--;
			subcategory.save();
			category.save();
			Product.remove({ _id: product._id }).exec()
				.then(result => {
					res.status(200).json({
						success: true,
						message: "Product has been deleted",
					});
				})
				.catch(err => {
					res.status(500).json({
						success: false,
						error: err
					});
				});

		}

	]);
	
}