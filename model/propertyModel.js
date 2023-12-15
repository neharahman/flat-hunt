const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const propertySchema = new Schema({
    title:{type:String},
    description:{type:String},
    propertyType:{type:String},
    city:{type:String},
    location:{type:String},
    photo:{type:String},
    creator:{type:mongoose.Schema.Types.ObjectId}
})

const propertyModel=mongoose.model('Property',propertySchema)
module.exports=propertyModel