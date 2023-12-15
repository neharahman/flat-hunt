const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const propertyRoutes = require('./route/propertyRoutes.js');
const userRoutes = require('./route/userRoutes.js');
const app=express()
const cors = require('cors');
dotenv.config({path:'./config.env'})
const {connectDb} = require('./db/connect.js');
const expressFileupload = require('express-fileupload');

//bodyparser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())
app.use(expressFileupload())




//db connection
// const db=process.env.DATABASE.replace('<password>',process.env.PASSWORD).replace('<username>',process.env.USER_NAME)
// mongoose.connect(db).then(()=>console.log('database connected')).catch(err=>console.log(err))

const startServer=async()=>{
    try{
        //db
        connectDb()

        //routes
        app.use('/',propertyRoutes)
        app.use('/user',userRoutes)
        
        //port
        app.listen(process.env.PORT,()=>{
            console.log('connected to the server')
        })        
    }catch(err){
        console.log(err)
    }
}
startServer();

