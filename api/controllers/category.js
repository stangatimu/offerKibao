const Category = require("../models/category.js"),
	  mongoose = require("mongoose"),
	  SubCategory = require("../models/subcategory.js"),
	  async = require("async");

//main cartegory controllers
exports.category_get_all = function (req, res, next) {
	 Category.find()
	.populate('subcategories','name _id products')
 	.exec()
 	.then(category =>{
 		if (category) {
 			res.status(200).json({
				success:true, 
				category:category});
 		} else {
 			res.status(404).json({
				success: false, 
				message:'No entries found'});
 		}
 	})
 	.catch(err=>{
 		res.status(500).json({error:err});
 	});
}

exports.category_create = function (req, res, next) {
	const category = new Category({
		name: req.body.name,
		image: req.file.path,
	});
	Category.create(category,(err, newCategory)=>{
		if (err) {
			res.status(500).json({
				success: false,
				message: "Category could not be created",
				error: err,
			});
		}else{
			res.status(201).json({
				success:true,
               message:'a category has been posted',
               new:newCategory
	         });
		}
	});
}


exports.category_delete = function (req, res, next) {
	var id = req.params.id;
	Category.remove({_id: id}).exec()
	.then(result=>{
		res.status(200).json({
			success: true,
            message:'a category has been deleted'
        });
	})
	.catch(err=>{
		res.status(500).json({
			success:false,
			error:err});
	});
}
///////////////////////////
//sub category controllers/
///////////////////////////

// create a subcategory
exports.subcategory_create = function (req, res, next) {
	const subcategory = new SubCategory({
		name: req.body.name
	});

	async.waterfall([
		function(callback){
			SubCategory.create(subcategory,(err,newSubCategory)=>{
				if (err) {
					return next(err);
				}else{
					callback(err, newSubCategory);
				}
			});
		},
		function(newSubCategory,callback){
			Category.findOne({_id: req.body.category},(err,category)=>{
				if(err) return next(err);
				category.subcategories.push(newSubCategory._id);
				category.save();
				res.status(200).json({
					success: true,
					message:"subcategory has been created",
					category: category
				})

			});
		}
	]);

	
}