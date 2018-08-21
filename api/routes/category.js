const express = require('express'),
 router = express.Router(),
 checkAuth = require("../middleware/checkAuth.js"),
 multer = require('multer'),
 categoryController = require("../controllers/category.js");
 

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

router.get('/', categoryController.category_get_all ); 

router.patch('/edit/:id',categoryController.category_edit);

router.get('/:name', categoryController.get_subccategories );

router.post('/',upload.single('image'), categoryController.category_create);

router.delete('/:id',checkAuth, categoryController.category_delete);

router.post('/subcategory',categoryController.subcategory_create);


module.exports = router;