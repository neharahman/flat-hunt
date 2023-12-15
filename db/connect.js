const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports.connectDb=async()=>{
   
    const db=process.env.DATABASE.replace('<password>',process.env.PASSWORD).replace('<username>',process.env.USER_NAME)
    mongoose.set('strictQuery',true)
    mongoose.connect(db).then(()=>console.log('database connected')).catch(err=>console.log(err))
}