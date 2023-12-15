const propertyModel = require('../model/propertyModel.js');
const userModel = require('../model/userModel.js');
const {verifyToken} = require('../other/jwtToken.js');
const AWS =require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' })
const s3 = new AWS.S3({
    accessKeyId:'AKIAQ4X6F3OVLGYO274A',
    secretAccessKey:'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'
  })


module.exports.createProperty = async (req,res)=>{
    try{
        const imageFile = req.files.imageFile
        console.log('imageFile',imageFile)
        //aws s3
        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageFile.name,
            Body:imageFile.data,
          }).promise()
          console.log('uploaded images',uploadedImage)
          
        const {title,description,propertyType,city,location,price,photo,creator}=req.body
        console.log(title,description,propertyType,city,location,price,photo,creator)
        //imageFile.mv(`${__dirname}/../images/${imageFile.name}`,err=>{if(err)console.log(err)})
        console.log('inside createProperty')
        const {authorization}=req.headers
        //verify token 
        let jwt = await verifyToken(authorization);
        console.log(jwt);

        if(jwt){
            const propertyModel_temp=new propertyModel({
                title,description,propertyType,city,location,price,
                photo:uploadedImage.Location,
                creator:jwt.id
            })
            const save_propertyModel=await propertyModel_temp.save()
            console.log(save_propertyModel)

            //trying to find user in user table
            let isUserExist=await userModel.findById({_id:jwt.id})
            isUserExist['property_id'].push(propertyModel_temp._id)
            //inserting in userModel 
            let isExistUser = await userModel.findByIdAndUpdate({_id:jwt.id},isUserExist)
            console.log('hello user inserted in db',isExistUser)
            res.status(200).json({
                status:'successfull',
                message:'property created',
                data:save_propertyModel
            })
        }
        else{
            res.status(401).json({
                status:'fail',
                message:'please login first to create property'
            })
        }
    }catch(err){
        if(err) console.log('inside create property',err)
        res.status(400).json({
            status:'fail',
            message:'create property fail',
            error:err
        })
    }

}


//get all property
module.exports.getAllProperties= async (req,res)=>{
    try{
        let {city,location}=req.body
        console.log('inside getAllProperties',city,location)
        let allProperties=await propertyModel.find({$or:[{'location':location },{'city':city}]})
        res.status(200).json({
            status:'success',
            message:'all propeerties',
            total:allProperties.length,
            allProperties
        })
        console.log(allProperties)
        
    }catch(err){
        if(err) console.log('inside get all properties',err)
        res.status(400).json({
            status:'fail',
            message:'fail to get all properties',
            error:err
        })
    }
}


//get property detail
module.exports.getPropertyDetail= async (req,res)=>{
    try{
        let {title,id}=req.body
        console.log('inside getPropertyDetail',title,id)

        let propertyDetail=await propertyModel.findOne({$or:[{'_id':id },{'title':title}]})
        if(propertyDetail)
        {
            res.status(200).json({
            status:'success',
            message:'one propeerties',
            propertyDetail
            })
        }
        else{
            res.status(404).json({
            status:'fail',
            message:'property not found'
            })
        }
    }catch(err){
        if(err) console.log('inside property detail',err)
        res.status(400).json({
            status:'fail',
            message:'fail to display property detail',
            error:err
        })
    }
}


//update property details
module.exports.updateProperty= async (req,res)=>{
    try{
        const {title,description,propertyType,city,location,price,photo}=req.body
        const {id}=req.params
        console.log('insile updateProperty',id)

        const isExist_updatedProperty = await propertyModel.findByIdAndUpdate({_id:id},{
            title,description,propertyType,city,location,price,photo
        })

        if(!isExist_updatedProperty){
            res.status(404).json({
                status:'failure',
                message:'data not found'
            })
        }
        else
        {
            res.status(200).json({
            status:'success',
            message:'updated property detail',
            data:isExist_updatedProperty
            })
        }
       

    }catch(err){
        console.log(err)
    }
}


//delete property
module.exports.deleteProperty = async (req,res) =>{
    try{
        const {id}=req.params
        console.log('insile deleteProperty',id)
        let isExist_deleteProperty = await propertyModel.findByIdAndDelete({_id:id})
        
        if(!isExist_deleteProperty){
            res.status(404).json({
            status:'failure',
            message:'sorry data not found'
            })
        }
        else
        {
            res.status(200).json({
            status:'success',
            message:'delete property',
            data:isExist_deleteProperty
            })
        }
        
    }catch(err){
        console.log(err)
    }

}