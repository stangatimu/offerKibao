const Category = require("../models/category.js"),
	  mongoose = require("mongoose"),
	  SubCategory = require("../models/subcategory.js"),
	  async = require("async");

//main cartegory controllers
exports.category_get_all = function (req, res, next) {
	 Category.find()
	.select('name image products')
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
//edit category
exports.category_edit = function (req, res, next) {
	var id = req.params.id;
	Category.findOne({_id: id}).exec()
	.then(category =>{
		if(category == null){
			return res.status(404).json({
				success:false,
				error:'no entry found'}); 
		}
		category.image = req.body.image
		category.save()
		res.status(200).json({
			success: true,
			message:'edit successfull',
			result: category
        });
	})
	.catch(err=>{
		res.status(500).json({
			success:false,
			error:err.message});
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

//get subcategories for one ctegory
exports.get_subccategories = function (req, res, next) {
	Category.findOne({name: req.params.name})
   .populate('subcategories','name _id products')
	.exec()
	.then(category =>{
		if (category) {
			res.status(200).json({
			   success:true, 
			   subcategory:category.subcategories
			});
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
// create a subcategory
exports.subcategory_create = async function (req, res, next) {
	const subcategory = new SubCategory({
		name: req.body.name
	});

	try{
		let category = await Category.findById(req.body.category);
		if(category != null){
			const newSubcategory = await SubCategory.create(subcategory);
			category.subcategories.push(newSubcategory._id);
			category.save();
			return res.status(200).json({
				success: true,
				message:"subcategory has been created",
				category: category
			})
		}
		return res.status(400).json({
			success: false,
			message:"subcategory could not be created"
		}) 
	}catch(err){
		res.status(500).json({
			success: false,
			message:"subcategory could not be created"
		})

	}


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
				

			});
		}
	]);

	
}