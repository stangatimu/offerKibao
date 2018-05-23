const express = require('express'),
 router = express.Router(),
 checkAuth = require("../middleware/checkAuth.js"),
 mongoose = require("mongoose"),
 multer = require('multer'),
 productsController = require("../controllers/products.js"),
 rateLimit = require('../middleware/rate-limit');
 

 const storage = multer.diskStorage({
 	destination: function(req, file, cb){
 		cb(null,'./uploads');
 	},
 	filename: function(req, file, cb){
 		cb(null, new Date().toDateString() + file.originalname);
 	}
 });

const fileFilter = (req,file, cb)=>{
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}
const upload = multer({storage: storage,
	                   limits:{
	                   	fileSize: 1024 * 1024 * 5
	                   },
	                   fileFilter: fileFilter
                     });

router.get('/',rateLimit.globalBF.prevent, productsController.products_get_all );

router.get('/location',productsController.products_get_by_location);

router.get('/:id',rateLimit.globalBF.prevent,productsController.products_get_one);

router.get('/category/:id',rateLimit.globalBF.prevent,productsController.products_get_category);

router.get('/subcategory/:id',rateLimit.globalBF.prevent,productsController.products_get_subcategory);

router.get('/user/:id',rateLimit.globalBF.prevent,checkAuth,productsController.products_get_user_products);


router.post('/',rateLimit.globalBF.prevent,checkAuth, productsController.products_create );


router.patch('/:id',rateLimit.globalBF.prevent,checkAuth, productsController.products_patch);

router.delete('/:id',rateLimit.globalBF.prevent,checkAuth, productsController.products_delete);
module.exports = router;