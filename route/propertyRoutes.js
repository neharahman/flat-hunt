const express = require('express');
const route = express.Router();
const {createProperty,getAllProperties,getPropertyDetail,updateProperty,deleteProperty} = require('../controller/propertyController.js');
const {imageFile} = require('../controller/imageFile.js')

route.get('/home',(req,res)=>{
    res.send('hello sweet home')
})
route.post('/create-property',createProperty)
//route.post('/all-Properties',getAllProperties)
route.post('/property/display',getAllProperties)
route.post('/property/detail',getPropertyDetail)
route.post('/property/update/:id',updateProperty)
route.post('/property/delete/:id',deleteProperty)

//delete this 
route.post('/image1',imageFile)

module.exports=route