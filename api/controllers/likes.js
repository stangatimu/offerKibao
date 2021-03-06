const Like =  require("../models/likes.js"),
async = require('async'),
Product =  require("../models/products.js");

//creating a new like
exports.likes_create = (req,res,next)=>{
    const newlike = new Like({
        prodId: req.body.Id,
        userId: req.userData.userId
    });
    //look for a matching like
    Like.findOne({prodId: req.body.Id, userId: req.userData.userId},(err,like)=>{
        //if we find a like we use like.prodId to find a product
        if (like) {
            Product.findOne({ _id: like.prodId }, (err, product) => {
                if(err || product == null){
                    return res.status(404).json({
                        success: false,
                        message: "Sorry, product not found."
                    });
                }
                return res.status(200).json({
                    success: true,
                    rating: product.rating,
                });
            });
        }else{
          async.parallel([
              //find a product for the provided id
              function(callback){
                  Product.findById(req.body.Id,(err,product)=>{
                      callback(err, product);
                  })
              },
              //we create a like for the product
              function(callback){
                  Like.create(newlike,(err,_like)=>{
                    callback(err,_like);
                  })
              }
          ],(err,result)=>{
              //check for errors and return error message
              if(err){
                  return res.status(404).json({
                    success: false,
                    message: "Sorry, product not found."
                });
              }
              //increament product ratind by one and save product
              product = result[0];
              product.rating++;
              product.save();
              console.log(product);
              return res.status(200).json({
                  success: false,
                  rating: product.rating
              })
          });
        }
    });
}

