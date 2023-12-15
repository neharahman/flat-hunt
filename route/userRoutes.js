const express = require('express');
const route = express.Router();
const {userSignup,userLogin,userProfile,userAllProperty,userPropertyById} = require('../controller/userController.js');


route.post('/signup',userSignup)
route.post('/login',userLogin)
route.post('/profile',userProfile)
route.post('/profile/property',userAllProperty)
route.post('/profile/property/:id',userPropertyById)

module.exports=route