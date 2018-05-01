var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose  = require('mongoose');
var bcrypt = require('bcrypt');
var advo  = require('./lib/user/userRout.js');
app.use(bodyparser({limit: '50mb'}))
app.use(bodyparser.urlencoded({limit: '50mb'}));
app.use(bodyparser());

app.use(bodyparser.json());
mongoose.connect('mongodb://localhost/ShopingDb');
var merchandise = require('./lib/shoping/merchandise1');
var USER =require('./lib/user/userRout');

app.use('/user',USER);
app.use('/merchandise/',merchandise);
app.use('/advo/*', function(req, res, next){
    let userid = req.body.userid;
    var token =  req.headers["authorization"];
  if (token) {
    try {
      token = token.split(' ')[1];

      var decoded = jwt.verify(token,'secret',function (err,decoded){

        if(err){

          res.send({status :400, message: 'Authorization token is not valid',error : err});
        }else {
          console.log(decoded,"decoded token")
          req.user = decoded;

              if(userid){
               User.findOne({ _id : req.body.userid },{ active :1 }, function(err, userStatus){

                  if(err) res.send({ status : 400, message : 'Please login again'});
                  console.log('userStatususerStatus',userStatus);
                  if(!userStatus){
                    res.send({ status : 400, message : 'User doest not exists.'})
                  }
                  else if(userStatus.active){
                      next();
                  }
                  else{
                         console.log('dddddddddddddddddddddddddddddd',userStatus.active)
                      res.send({ status : 400, message : 'Please login again'})
                  }
              })

            }
            else{
              res.send({ status : 400, message : 'Please enter user ID'})
            }

          // next();
        }
      });
    } catch (e) {
      console.log('myyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',e);
      return res.send({status:400, message: 'Authorization token is not valid'});
    }
  } else {
    console.log("No token");
    return res.send({status:400,message: 'Authorization token missing in request.'});
  }
})

app.use('/advo', advo);




app.listen(9090,function(req,res){
  console.log("port 9090 is Running......................... ");
})
module.exports = app;
