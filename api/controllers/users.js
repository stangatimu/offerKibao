 const User = require("../models/users.js"),
       mongoose = require("mongoose"),
       bcrypt = require("bcrypt"),
       jwt = require("jsonwebtoken");

 exports.users_signup = (req, res, next)=>{
	User.find({email: req.body.email})
	.exec()
	.then( user =>{
		if (user.length>=1) {
			return res.status(409).json({
				success: fasle,
				message: "The email is already registered"
			});
		} else {
			  bcrypt.hash(req.body.password,10, (err, hash)=>{
              if (err) {
            	return res.status(500).json({
					success: false,
            		error: "Registration failed"
            	});
              } else {
				  const adrs = {
					  city: req.body.city,
					  street: req.body.street
				  }
            	const user = new User({
					_id: new mongoose.Types.ObjectId(),
					name: req.body.name,
					email: req.body.email,
					password: hash,
					address: adrs
					
	            });
	            user.save()
	            .then( result=>{
					const token = jwt.sign({
						email:user.email,
						userId: user._id
					  }, process.env.jwtkey,
					  { expiresIn: "7d"}
					);
	            	console.log(result);
	            	res.status(201).json({
						success: true,
						message: 'user created',
						token: token
	            	});
	            })
	            .catch( err =>{
	            	console.log(err);
	            	res.status(500).json({
						success: false,
	            		error: err
	            	});
	            });
               }
		   });

		}
	})
	.catch();
}
exports.users_login = (req, res, next)=>{
	User.findOne({email: req.body.email})
	.exec()
	.then( user =>{
		if (!user) {
			return res.status(401).json({
				success: false,
				message:"Authentication failed"});
		}
		comparePassword(req.body.password,user,res);
		
	})
	.catch();
}
//display profile
exports.users_profile = function(req,res,next){
	User.findOne({_id: req.userData.userId})
	.exec()
	.then(user =>{
		res.status(200).json({
			success: true,
			user: user
		});
	});
}
//edit profile
exports.users_edit = function(req,res,next){
	User.findOne({_id: req.userData.userId}, (err,user)=>{
		if(err)return next(err);
		if(req.body.name) user.name = req.body.name;
		if(req.body.email) user.email = req.body.email;
		if(req.body.city) user.address.city = req.body.city;
		if(req.body.street) user.address.street = req.body.street;
		if(req.body.password){
			bcrypt.hash(req.body.password,10, (err, hash)=>{
				if (err) {
				  return res.status(500).json({
					  success: false,
					  error: "could not save changes"
				  });
				  user.password = hash;
				}
			});
			 
		}
		user.save();
		res.status(200).json({
			success: true,
			message: "changes saved successfully",
			user: user
		})
		
	});
	
}

exports.users_delete = function (req, res, next) {
	var id = req.params.id;
	User.remove({_id: id}).exec()
	.then(result=>{
		res.status(200).json({
			success: true,
			message:"User has been deleted"
		});
	})
	.catch(err=>{
		res.status(500).json({
			success: false,
			error:err});
	});
}

//compare password function(bodyPassword, user, res)
comparePassword = (password1,user,resp)=>{
	bcrypt.compare(password1, user.password, (err, result)=>{
		if (err) {
			return resp.status(401).json({
				success: fasle,
				message:"Authentication failed"
			});
		}
		if (result) {
			const token = jwt.sign({
				email:user.email,
				userId: user._id
			  }, process.env.jwtkey,
			  { expiresIn: "7d"}
			);
			return resp.status(200).json({
				success: true,
				message:"Authentication successful",
				token: token
			});
		}
		return resp.status(401).json({
			success: fasle,
			message:"Authentication failed"
		});
	});
}