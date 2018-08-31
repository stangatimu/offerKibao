const express = require('express'),
 router = express.Router(),
 checkAuth = require("../middleware/checkAuth.js"),
 mongoose = require("mongoose"),
 multer = require('multer'),
 productsController = require("../controllers/products.js"),
 rateLimit = require('../middleware/rate-limit'),
 likesController = require('../controllers/likes.js');
 

router.get('/',rateLimit.globalBF.prevent, productsController.products_get_all );

router.get('/location',rateLimit.globalBF.prevent,productsController.products_get_by_location);

router.get('/top',rateLimit.globalBF.prevent,productsController.products_get_top);

router.get('/:id',rateLimit.globalBF.prevent,productsController.products_get_one);

router.get('/category/:id',rateLimit.globalBF.prevent,productsController.products_get_category);

router.get('/subcategory/:id',rateLimit.globalBF.prevent,productsController.products_get_subcategory);

router.get('/user/:id',rateLimit.globalBF.prevent,productsController.products_get_user_products);

router.post('/',rateLimit.globalBF.prevent,checkAuth, productsController.products_create );

router.post('/likes', rateLimit.globalBF.prevent,checkAuth,likesController.likes_create);

router.patch('/:id',rateLimit.globalBF.prevent,checkAuth, productsController.products_patch);

router.delete('/:id',rateLimit.globalBF.prevent,checkAuth, productsController.products_delete);
module.exports = router;