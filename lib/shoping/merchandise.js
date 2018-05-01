const Product = require('./product');
const Order = require('./order');
const User = require('../user/userModel');
var fs = require('fs');
cloudinary = require('cloudinary'),
cloudinary.config({
        cloud_name: 'dodscctjl',
        api_key: 'XXXXXXXXXXXXXXXXXXXXXX',
        api_secret: 'UUUUUUUUUUUUUUUUUUUUUUUUUUUU'
    });

module.exports = {
 'imageUpload' : (req, res)=>{
      var imageRes = "Image uploaded successfully"
      var img_base64 = req.body.image;
      binaryData = new Buffer(img_base64, 'base64');
      fs.writeFile("test.jpeg", binaryData, "binary", function(err) {
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhh');
          if (err) {
              console.log("errror in writtting file")
          } else {
                  cloudinary.uploader.upload("test.jpeg", function(result) {
                      if (result.url) {
                          res.json({
                              responseCode: 200,
                              responseMessage:"image upload successfully",
                              url: result.url
                          });
                      }
                  })
          }
      });
  },

'listProduct':(req,res)=>{
  if(!req.body.user_id || !req.body.name || !req.body.size || !req.body.colour || !req.body.prize || !req.body.type
    || !req.body.category || !req.body.images || !req.body.title ||!req.body.quantity || !req.body.brand)
    res.json({statusCode : 402 , message : 'PLease fill the required fields.'})
  else
  Product.create({
  name:req.body.name,
  brand:req.body.brand,
  category:req.body.category,
  type:req.body.type,
  size:req.body.size,
  price:req.body.prize,
  colour:req.body.colour,
  productBy:req.body.user_id,
  images:req.body.images,
  description:req.body.description,
  title:req.body.title,
  quantity:req.body.quantity,
  createdAt:new Date().getTime()
  })
.then((success)=>{
  if(success)
    res.json({statusCode : 200 , message : 'Your product listed successfully.', data:success})
  else
    res.json({statusCode : 500 , message : 'Something went wrong.'})
})
.catch((unsuccess)=>{
  console.log("unsuccess in list product:::: ",unsuccess)
  res.json({statusCode : 500 , message : 'Something went wrong.'})
})
},
'getProduct':(req,res)=>{
  Product.find({status:true})
  .then((success)=>{
     if(success.length)
    res.json({statusCode : 200 , message : 'Products fetch successfully.', data:success})
  else
    res.json({statusCode : 500 , message : 'No product listed.'})
  })
  .catch((unsuccess)=>{
  console.log("unsuccess in get product:::: ",unsuccess)
  res.json({statusCode : 500 , message : 'Something went wrong.'})
  console.log("this is unsucess")
})
},
'buy':(req,res)=>{
  if(!req.body.user_id || !req.body.address || !req.body.product)
    res.json({statusCode : 402 , message : 'PLease fill the required fields.'})
  else
 {
    Order.create({
  owenbuy:req.body.user_id,
  address:req.body.address,
  product:req.body.product
    })
  .then((success)=>{
     if(success){
    res.json({statusCode : 200 , message : 'Products ordered successfully.', data:success})
    Mail.buyproduct(req.body,success,function(msg){
     console.log("the mail send sucessfully",success);
  })
}
  else
    res.json({statusCode : 500 , message : 'Something went wrong'})
  })
  .catch((unsuccess)=>{
  console.log("unsuccess in get product:::: ",unsuccess)
  res.json({statusCode : 500 , message : 'Something went wrong.'})
})
}
},
'editProduct':(req,res)=>{
   if(!req.body.user_id || !req.body.name || !req.body.size ||
    !req.body.colour || !req.body.prize || !req.body.type
    || !req.body.category || !req.body.images || !req.body.title
    ||!req.body.quantity || !req.body.product_id || !req.body.brand)
    res.json({statusCode : 402 , message : 'PLease fill the required fields.'})
  else
  Product.update({_id:req.body.product_id},{$set:{
  name:req.body.name,
  brand:req.body.brand,
  category:req.body.category,
  type:req.body.type,
  size:req.body.size,
  price:req.body.prize,
  colour:req.body.colour,
  productBy:req.body.user_id,
  images:req.body.images,
  description:req.body.description,
  title:req.body.title,
  quantity:req.body.quantity,
  outOfStock:req.body.outOfStock,
  status:false
  }},{new:true})
.then((success)=>{
  if(success)
    res.json({statusCode : 200 , message : 'Your product edited successfully, it will reviewed by admin before listed on site.', data:success})
  else
    res.json({statusCode : 500 , message : 'Something went wrong.'})
})
.catch((unsuccess)=>{
  console.log("unsuccess in edit product product:::: ",unsuccess)
  res.json({statusCode : 500 , message : 'Something went wrong.'})
})
},
makeList:(req,res)=>{
  if(!req.body.product_id)
    res.json({statusCode : 402 , message : 'Please fill the required fields.'})
  else
    Product.update({_id:req.body.product_id},{$set:{status:true}},{new:true})
  .then((success)=>{
  if(success)
    res.json({statusCode : 200 , message : 'Product listed successfully!!!', data:success})
  else
    res.json({statusCode : 500 , message : 'Something went wrong.'})
})
.catch((unsuccess)=>{
  console.log("unsuccess in makelist:::: ",unsuccess)
  res.json({statusCode : 500 , message : 'Something went wrong.'})
})
},
'userOrders':(req,res)=>{
  if(!req.body.user_id)
    res.json({statusCode : 402 , message : 'Please fill the required fields.'})
  else
    Order.find({owenbuy:req.body.user_id}).populate('owenbuy product')
    .then((success)=>{
  if(success)
    res.json({statusCode : 200 , message : 'Orders', data:success})
  else
    res.json({statusCode : 500 , message : 'Something went wrong.'})
})
.catch((unsuccess)=>{
  console.log("unsuccess in makelist:::: ",unsuccess)
  res.json({statusCode : 500 , message : 'Something went wrong.'})
})
}

}
