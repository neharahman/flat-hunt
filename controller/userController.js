const userModel = require('../model/userModel.js');
const propertyModel = require('../model/propertyModel.js');
const {createHashPassword,comparePassword} = require('../other/hashPassword.js')
const {createToken,verifyToken} = require('../other/jwtToken.js');

module.exports.userSignup = async (req,res) =>{
    try{
        const {name,phone,password}=req.body
        console.log('inside userSignup',phone,name,password)

        const saltPassword = await createHashPassword(password,12)
        console.log('inside userSignup createpassword',saltPassword)

        //insert user
        let userModel_temp = new userModel({name,phone,password:saltPassword})
        let user = await userModel_temp.save()
        let jwt=await createToken(user._id)
        console.log('inside Signup here is the token',jwt)
        res.status(200).json({
            status:'success',
            message:'signup successfully',
            name,
            token:jwt
        })
    }catch(err){
        console.log(err)
    }
}


//userlogin
module.exports.userLogin = async (req,res) =>{
    try{
        let {phone,password}=req.body
        console.log('inside login',phone,password)

        let isPhone_exist=await userModel.findOne({phone:phone})
        if(!isPhone_exist){
            res.status(404).json({
                status:'fail',
                message:'please check the phone number'
            })
        }
        else{
            console.log(isPhone_exist.password)
            let saltPassword = await comparePassword(password,isPhone_exist.password)
            if(saltPassword){
                let jwt=await createToken(isPhone_exist._id)
                res.status(200).json({
                    status:'success',
                    message:'successfully logged in',
                    data:jwt
                })
            }
            else{
                res.status(401).json({
                status:'fail',
                message:'incorrect password'
                })
            }
        }
        
        
    }catch(err){
        if(err) console.log('inside login',err)
        res.status(400).json({
            status:'fail',
            message:'login fail',
            error:err
        })

    }
}

//user profile
module.exports.userProfile = async (req,res) =>{
    try{
        const {authorization}=req.headers
        console.log('inside profile hello authorization',authorization)
        let jwt=await verifyToken(authorization)
        if(jwt){
            let userModel_temp=await userModel.findOne({_id:jwt.id})
            console.log(userModel_temp)
            res.status(200).json({
                status:'SUCCESS',
                message:"hello profile",
                data:userModel_temp
    
            })
        }

    }catch(err){
        if(err) console.log('inside profile',err)
        res.status(400).json({
            status:'fail',
            message:'please login first',
            error:err
        })
    }
}

//user all property in profile
module.exports.userAllProperty = async (req,res) =>{
    try{
        const {authorization}=req.headers
        //verify token 
        let jwt = await verifyToken(authorization)
        if(jwt){
            let isUserExist=await userModel.findById({_id:jwt.id})
            
            let property= await propertyModel.find({creator:isUserExist._id})
            res.status(200).json({
                status:'success',
                message:'all properties created by user',
                total:property.length,
                property
            })
        }
        else{
            console.log('something went wrongs')
        }

    }catch(err){
        if(err) console.log('inside all user profile',err)
        res.status(400).json({
            status:'fail',
            message:'please check all user detail',
            error:err
        })
    }
}

//userPropertyById
module.exports.userPropertyById = async (req,res) =>{
    try{
        
        const {authorization}=req.headers
        const {id}=req.params
        console.log('inside user propertyById')
        let jwt = await verifyToken(authorization)
            if(jwt){
                let property=await propertyModel.findOne({$and:[{_id:id},{creator:jwt.id}]})
                console.log(property)
                if(property){
                    res.status(200).json({
                        status:'success',
                        message:'property display',
                        property
                    })
                }
                else{
                    res.send('something went wrong')
                }
            }
            else{
                res.status(400).json({
                    status:'fail',
                    message:'something went wrong',
                })
            }

    }catch(err){
        console.log(err)
    }
    
}