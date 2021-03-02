var bcrypt = require('bcryptjs');
const User=require("../../models/Users");
const inputHelpers=(email,password)=>{
    return email&&password;
}
const comparePassword=(password,hashedPassword)=>{
    return bcrypt.compareSync(password,hashedPassword);
}
const registerHelpers=(name,email,password,confirmPassoword)=>{
    return name&&email&&password&&confirmPassoword
}
const password2Exsist=(password,password2)=>{
    return password===password2
}
const emailController=async(email)=>{
    const query={email:email};
    const user =await User.findOne(query);
    return user;
}
module.exports={inputHelpers,comparePassword,registerHelpers,password2Exsist,emailController};