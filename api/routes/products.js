const express = require('express'),
 router = express.Router(),
 checkAuth = require("../middleware/checkAuth.js"),
 mongoose = require("mongoose"),
 multer = require('multer'),
 productsController = require("../controllers/products.js"),
 searchController = require("../controllers/product-search.js");
 

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

router.get('/', productsController.products_get_all );

router.get('/:id',productsController.products_get_one);

router.get('/category/:id',productsController.products_get_category);

router.get('/subcategory/:subId',productsController.products_get_subcategory);

router.get('/search',searchController.products_search);

router.get('/user/:id',checkAuth,productsController.products_get_user_products);

router.post('/',checkAuth,upload.single('image'), productsController.products_create );


router.patch('/:id',checkAuth, productsController.products_patch);
router.delete('/:id',checkAuth, productsController.products_delete);
module.exports = router;