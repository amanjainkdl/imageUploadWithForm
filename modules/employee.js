const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/inventory', {useNewUrlParser: true, useUnifiedTopology: true});
var connect = mongoose.connection;

var employeeSchema = new mongoose.Schema({
    name : String,
    email : String,
    etype : String,
    ratePerHour : Number,
    totalHourWorked : Number,
    totalSal : Number
   });
   employeeSchema.methods.totalSalary =function(){
     return this.ratePerHour * this.totalHourWorked;
   }

   var employeeModel = mongoose.model('Employee',employeeSchema);

   module.exports = employeeModel;