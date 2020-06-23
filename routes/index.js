var express = require('express');
var empModel = require('../modules/employee.js');
var multer  = require('multer');
var path = require('path');
var router = express.Router();
var employee = empModel.find({});
var flag = 'index';
router.use(express.static(__dirname+'./public/'));

/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec(function(err,data){
    if(err){
      throw err;
    }
    var msg;
    if(flag == 'index'){
      msg = ""
    }else if(flag == 'update'){
      msg ="Data updated successfully."
    }
    else if(flag == 'delete'){
      msg ="Data deleted successfully."
    }
    
    res.render('index', { title: 'Employee Records', records:data , success:msg});
    flag='index';
  })  
}); 

var storage = multer.diskStorage({
  destination:'./public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }  
})

var upload = multer({ storage: storage }).single('profilePic');

router.post('/',upload,function(req,res){
  var emplDetails = new empModel({
    name : req.body.name,
    email : req.body.email,
    etype : req.body.etype,
    ratePerHour : req.body.rateHour,
    totalHourWorked : req.body.totalhourworked,
    totalSal : parseInt(req.body.rateHour) * parseInt(req.body.totalhourworked)
  })
 
  emplDetails.save(function(err,res1){
    if(err) throw err
    employee.exec(function(err,data){
      if(err){
        throw err;
      }
      res.render('index', { title: 'Employee Records', records:data, success:"Data inserted successfully"});
    })
  })  
});

router.get('/delete/:id',function(req,res){
 var deletedRecord = empModel.findByIdAndDelete(req.params.id);
 deletedRecord.exec(function(err){
   if(err){
     throw err;
   }
   flag = 'delete';
   res.redirect('/');
 })
})

router.get('/edit/:id',function(req,res){
  var edit = empModel.findById(req.params.id);
   edit.exec(function(err,data){
    if(err) throw err;
    res.render('edit-table',{title:'Edit details',row:data})
  })
})

router.post('/update',function(req,res){
  console.log(req.body);
  var update = empModel.findByIdAndUpdate(req.body.id,{
    name : req.body.name,
    email : req.body.email,
    etype : req.body.etype,
    ratePerHour : req.body.ratePerHour,
    totalHourWorked : req.body.totalHourWorked,
    totalSal : parseInt(req.body.ratePerHour) * parseInt(req.body.totalHourWorked),
  });   
   update.exec(function(err){
    if(err) throw err;
      flag = 'update';
      res.redirect('/');
    })  
  })
module.exports = router;