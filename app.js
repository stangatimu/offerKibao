const express = require('express'),
 app = express(),
 morgan = require('morgan'),
 bodyparser = require("body-parser"),
 mongoose = require('mongoose'),
 helmet = require('helmet');



const productRoutes = require('./api/routes/products');
const categoryRoutes = require('./api/routes/category');
const userRoutes = require('./api/routes/users');
app.use(helmet());
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
mongoose.connect("mongodb://hapi:Mynameisstan1@ds115740.mlab.com:15740/hapidb",()=>{
	console.log("connected to mlab");
});

app.use((req, res, next)=>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
	if (req.body === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods','PUT, POST, DELETE, GET, PATCH');
		return res.status(200).json({});
	}
	next();
});


app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/users', userRoutes);
app.use((req,res, next)=>{
	const error = new Error('Not found');
	error.status = 404;
	next(error);
})
app.use((error,req,res,next)=>{
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	});
});
module.exports = app;
