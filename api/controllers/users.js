 const User = require("../models/users.js"),
       mongoose = require("mongoose"),
	   bcrypt = require("bcrypt"),
	   crypto = require("crypto"),
	   jwt = require("jsonwebtoken"),
	   Token = require("../models/token.js"),
	   sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

 exports.users_signup = (req, res, next)=>{
	 const ejs = false;
	User.find({email: req.body.email})
	.exec()
	.then( user =>{
		if (user.length>=1) {
			return res.status(409).json({
				success: false,
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
            	const user = new User({
					_id: new mongoose.Types.ObjectId(),
					name: req.body.name,
					email: req.body.email,
					password: hash					
	            });
				user.save()
				.then(result => {
						  const token = new Token({
							  _userId: user._id,
							  token: crypto.randomBytes(16).toString('hex'),
						  });
						  token.save();
						  //send mail custom function
						  sendMail(req,res, user, token, ejs);
						  
						  console.log(result);
					  })
	            .catch( err =>{
	            	console.log(err);
	            	res.status(500).json({
						success: false,
	            		error: err.message
	            	});
	            });
               }
		   });

		}
	})
	.catch(e =>{
		console.log(e)
	} );
}
//account or email confirmation
exports.email_confirmation = function (req, res, next) {
 
    // Find a matching token
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token)  return  res.render("resendConfirm",{
			message: "We were having trouble activating your account. Your link my have expired. Enter your email below to recieve another link"});
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
			if (!user) return res.render("passwordCofirm",{message: "We were having trouble activating your account."});
            if (user.isVerified) return res.render("passwordCofirm",{message: "Your account is already ativated. Please log in."});
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return  res.render("resendConfirm",{message: "We were having trouble activating your account. Your link my have expired.Enter your email below to recieve another link"}); }
                return  res.render("passwordCofirm",{message: "Account has been verified you can now log in in the app"});
            });
        });
    });
};
//resend confirmation email
exports.resend_confirmation = function (req, res, next) {
	const ejs = true;
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.render("passwordCofirm",{ message: 'Check '+req.body.email+ ' for verification link.' });
        if (user.isVerified) return res.render("passwordCofirm",{message: "Account is already activated.Please log in."});
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { if (user.isVerified) return res.render("passwordCofirm",{message: "we are having trouble sending you a link. Please try again latter"}); }
 
            // Send email custom fuction
			sendMail(req,res, user, token,ejs)
        });
 
    });
};


//log in logic
exports.users_login = (req, res, next)=>{
	User.findOne({email: req.body.email})
	.exec()
	.then( user =>{
		if (!user) {
			return res.status(401).json({
				success: false,
				message:"Authentication failed"});
		}
		//custom function at the buttom of this document
		comparePassword(req.body.password,user,res);
		
	})
	.catch(e =>{console.log(e)});
}
//display profile
exports.users_profile = function(req,res,next){
	User.findOne({_id: req.userData.userId})
	.exec()
	.then(user =>{
		res.status(200).json({
			success: true,
			user: {
				name: user.name,
				email: user.email,
				id: user._id,
				dp: user.dp
			}
		});
	});
}
//edit profile
exports.users_edit = function(req,res,next){
	User.findOne({_id: req.userData.userId}, (err,user)=>{
		if(err)return next(err);
		if(req.body.name) user.name = req.body.name;
		if(req.body.email) user.email = req.body.email;
		if(req.body.dp) user.dp = req.body.dp;
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
//deleting a particular user by ID
exports.users_delete = function (req, res, next) {
	var id = req.userData.userId;
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
				success: false,
				message:"Authentication failed"
			});
		}
		if (result) {
			if(!user.isVerified){
				return resp.status(401).json({
					success: false,
					message:"Account not activated, check your email to activate account"
				});
			}
			const token = jwt.sign({
				email:user.email,
				userId: user._id
			  }, process.env.jwtkey,
			  { expiresIn: "7d"}
			);
			return resp.status(200).json({
				success: true,
				message:"Authentication successful",
				user:{
					email: user.email,
					name: user.name
				},
				token: token,
				expiresIn: "7d"
			});
		}
		return resp.status(401).json({
			success: false,
			message:"Authentication failed"
		});
	});
}

//send mail function
sendMail = (req,res, user, token,ejs)=>{
	var mail = { 
		from: '"Stan Gatimu" <stangatimu@gmail.com>', 
		to: user.email, 
		subject: 'Offer  Kibao Account Verification', 
		text: 'Hello '+ user.name+',\n\nPlease verify your account by clicking the link: \nhttp:\/\/'+ req.headers.host+'\/users\/confirmation\/' + token.token + '.\n'
	   };
	   sgMail.send(mail);
	   if(ejs != false){
		   return res.render("passwordCofirm",{message: "A verification email has been sent to " + user.email + ", confirm email to log in."});
	   }else{
		res.status(200).json({
			success: true,
			message:'A verification email has been sent to ' + user.email + ',confirm email to log in.'
		   });

	   }
	
}