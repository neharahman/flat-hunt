const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const userSchema = new Schema({
    name:{type:String,required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true},
    profilePhoto:{type:String},
    property_id:{type:Array}
})

const userModel = mongoose.model('User',userSchema)
module.exports=userModel
