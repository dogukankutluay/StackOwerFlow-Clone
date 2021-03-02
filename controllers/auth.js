const {sendJwtToClient}=require("../helpers/authrozitaion/sendJwtToClient");
const {inputHelpers,registerHelpers,password2Exsist,comparePassword}=require("../helpers/input/inputHelpers");
const asyncHandler=require("express-async-handler");
const CustomError=require("../helpers/error/CustomError");
const User=require("../models/Users");
const sendEmail=require("../helpers/libraries/sendEmail");

const register=asyncHandler( async(req,res,next)=>{
    const {name,email,password,password1,role}=req.body;
    if(!registerHelpers(name,email,password,password1)){
        res.status(400).json({success:false,err:"Please check your inputs"})
    }
    if(!password2Exsist(password,password1)){
        res.status(400).json({success:false,err:"Please check your password"})
        
    }
    const user=await User.findOne({email})
    if(user){
        res.status(400).json({success:false,err:"This email is in use"})
    }
    const userRegister=await User.create({name,email,password})
    res.status(200)
    .json({
        success:true,
        data:userRegister
    })
});

const login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!inputHelpers(email,password)){
        return next(new CustomError("Please check your email or password",400)) 
    }
    const user =await User.findOne({email}).select("+password")
    if(!comparePassword(password,user.password)){
        return next(new CustomError("please checj your password"))
    }
    //sendJwtToClient(user,res)
    const token =user.generateTokenJwt();
    res.status(200)
    .json({
        success:true,
        acces_token:token,
        data:{
            name:user.name,
            email:user.email
        }
    })
})
const logout=asyncHandler(async(req,res,next)=>{
    const{NODE_ENV}=process.env;
    return res.status(200)
    .cookie({
        httpOnly:true,
        expires:new Date(Date.now()),
        secure:NODE_ENV==="development" ? false:true
    })
    .send.render("login");
   
    // .json(
    //     {
    //         success:true,
    //         message:"logout succesfull"
    //     }
    // )
});
const getUser1=asyncHandler(async(req,res,next)=>{
    const {email}=req.body;
    const user =await User.findOne({email}).select("email role name");
    console.log(email);
    console.log(user);
    sendJwtToClient(user,res);
    return res.render("dashboard",{
        name:user.name,
        role:user.role,
        email:user.email
    })
})

const getUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.user;
    const user= await User.findById(id);
    sendJwtToClient(user,res);
    return res.render("dashboard",{
        name:user.name,
        role:user.role,
        email:user.email
    })
    
    // .json({
    //     success:true,
    //     data:{
    //         id:req.user.id,
    //         name:req.user.name
    //     }
    // })
    
 
});
const imageUpload=asyncHandler(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.user.id,{
        "profile_image":req.savedProfileImage
    },{
        new:true,
        runValidators:true
    });


    res.status(200)
    .json({
        success:true,
        message:"image upload successfull",
        data:user
    })
});
const forgotPassword=asyncHandler(async(req,res,next)=>{
    const resetEmail=req.body.email;
    const user=await User.findOne({email:resetEmail});
    if(!user){
        return next(new CustomError("There is no user with that email",400));
    }
    const resetPasswordToken=user.getResetPasswordTokenFromUser();
    console.log(resetPasswordToken);
    
    await user.save();
    const resetPasswordUrl=`http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate=`
        <h3>Reset Your Password</h3>
        <p>This <a href="${resetPasswordUrl}" target='_blank'>link</a>will expıre in 1 hour</p>
    `;
    try {
        await sendEmail({
            from:process.env.SMTP_USER,
            to:resetEmail,
            subject:"Reset Your Password",
            html:emailTemplate
        });
        return res.status(200).render("pass2");
    } catch (error) {
        user.resetPasswordToken=null;
        user.resetPasswordExpire=null;
        await user.save();
        return next(new CustomError("Email colut not be send",500));
    }

    
});
const resetPassword=asyncHandler( async(req,res,next)=>{
    const resetPasswordToken=req.query.resetPasswordToken;
    const {password}=req.body;
    
    if(!resetPasswordToken){
        return next(new CustomError("Please porivide a valid token",400));
    }
    let user=await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{$gt : Date.now()}
    });
    if(!user){
        return next(new CustomError("Invalid Token or Session Expired",404));
    }
    user.password=password;
    user.resetPasswordToken=null;
    user.resetPasswordExpire=null;
    await user.save();
    return res.status(200)
    .json({
        success:true,
        message:"Reset Password prses successful"
    }) 
});
const editDetails=asyncHandler( async(req,res,next)=>{
    const editInfermation=req.body;
    const user=await User.findByIdAndUpdate(req.user.id,editInfermation,{
        new:true,
        runValidators:true
    });
    return res.status(200)
    .json({
        success:true,
        message:"User Details SuccessFul",
        data:user
    });
});
module.exports={ 
    resetPassword,logout,register,getUser,login,imageUpload,forgotPassword,getUser1,editDetails
};