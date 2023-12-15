const bcrypt = require('bcrypt');

module.exports.createHashPassword=async function(password,saltRound){
    const hashPassword=await bcrypt.hash(password,saltRound)
    return hashPassword
}

module.exports.comparePassword=async function(password,hash){
    let compare1=await bcrypt.compare(password,hash)
    console.log('inside compareHashPasswordFun',hash)
    return compare1
}